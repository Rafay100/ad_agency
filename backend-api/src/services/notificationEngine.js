const { Op, fn, col } = require('sequelize')
const { Notification, AlertRule, Campaign, Analytics } = require('../models')
const logger = require('../config/logger')

class NotificationEngine {
  constructor(io) {
    this.io = io
  }

  async evaluateAll() {
    const rules = await AlertRule.findAll({
      where: { isEnabled: true },
      include: [{ model: require('../models').User, as: 'user' }],
    })

    for (const rule of rules) {
      try {
        await this.evaluateRule(rule)
      } catch (error) {
        logger.error({ event: 'rule_evaluation_failed', ruleId: rule.id, error: error.message })
      }
    }
  }

  async evaluateRule(rule) {
    if (rule.lastTriggeredAt) {
      const cooldownMs = rule.cooldownMinutes * 60 * 1000
      if (Date.now() - new Date(rule.lastTriggeredAt).getTime() < cooldownMs) {
        return
      }
    }

    const campaigns = await Campaign.findAll({
      where: { userId: rule.userId, status: 'active', deletedAt: null },
    })

    for (const campaign of campaigns) {
      const shouldTrigger = await this.checkCondition(rule, campaign)
      if (shouldTrigger) {
        await this.triggerNotification(rule, campaign)
      }
    }
  }

  async checkCondition(rule, campaign) {
    const { type, condition } = rule

    switch (type) {
      case 'ctr_low': {
        const threshold = condition.threshold ?? 0.01
        const recentAnalytics = await Analytics.findAll({
          where: { campaignId: campaign.id },
          order: [['date', 'DESC']],
          limit: condition.periodDays || 3,
        })
        if (recentAnalytics.length === 0) return false
        const avgCTR = recentAnalytics.reduce((sum, a) => sum + parseFloat(a.ctr), 0) / recentAnalytics.length
        return avgCTR < threshold
      }

      case 'budget_high': {
        const threshold = condition.threshold ?? 0.9
        const spent = parseFloat(campaign.spent || 0)
        const budget = parseFloat(campaign.budget)
        if (budget === 0) return false
        return (spent / budget) >= threshold
      }

      case 'spend_rate': {
        const dailyLimit = condition.dailySpendLimit
        if (!dailyLimit) return false
        const today = new Date().toISOString().split('T')[0]
        const todayAnalytics = await Analytics.findOne({
          where: { campaignId: campaign.id, date: today },
        })
        if (!todayAnalytics) return false
        return parseFloat(todayAnalytics.spend) >= dailyLimit
      }

      case 'impressions_drop': {
        const dropPercent = condition.dropPercent ?? 0.5
        const recent = await Analytics.findAll({
          where: { campaignId: campaign.id },
          order: [['date', 'DESC']],
          limit: 7,
        })
        if (recent.length < 4) return false
        const avgRecent = recent.slice(0, 3).reduce((sum, a) => sum + a.impressions, 0) / 3
        const avgPrevious = recent.slice(3).reduce((sum, a) => sum + a.impressions, 0) / (recent.length - 3)
        if (avgPrevious === 0) return false
        return (avgPrevious - avgRecent) / avgPrevious >= dropPercent
      }

      default:
        return false
    }
  }

  async triggerNotification(rule, campaign) {
    const notification = await this.createNotification(rule, campaign)

    if (this.io) {
      this.io.to(`user:${campaign.userId}`).emit('notification:received', {
        id: notification.id,
        type: notification.type,
        severity: notification.severity,
        title: notification.title,
        message: notification.message,
        campaignId: notification.campaignId,
        createdAt: notification.createdAt,
      })
    }

    await rule.update({ lastTriggeredAt: new Date() })

    logger.info({
      event: 'notification_triggered',
      notificationId: notification.id,
      ruleId: rule.id,
      campaignId: campaign.id,
      userId: campaign.userId,
    })

    return notification
  }

  async createNotification(rule, campaign) {
    const templates = {
      ctr_low: {
        title: `Low CTR Alert: ${campaign.name}`,
        message: `CTR has dropped below ${(rule.condition.threshold * 100).toFixed(1)}%. Current average CTR needs attention.`,
        severity: 'warning',
      },
      budget_high: {
        title: `Budget Alert: ${campaign.name}`,
        message: `Campaign has used ${((parseFloat(campaign.spent) / parseFloat(campaign.budget)) * 100).toFixed(0)}% of its budget ($${parseFloat(campaign.spent).toFixed(2)} of $${parseFloat(campaign.budget).toFixed(2)}).`,
        severity: parseFloat(campaign.spent) >= parseFloat(campaign.budget) ? 'critical' : 'warning',
      },
      spend_rate: {
        title: `Daily Spend Alert: ${campaign.name}`,
        message: `Daily spend exceeded $${rule.condition.dailySpendLimit} today.`,
        severity: 'warning',
      },
      impressions_drop: {
        title: `Impressions Drop: ${campaign.name}`,
        message: `Impressions dropped by ${(rule.condition.dropPercent * 100).toFixed(0)}% compared to recent average.`,
        severity: 'warning',
      },
    }

    const template = templates[rule.type] || {
      title: rule.name,
      message: `Alert triggered for campaign: ${campaign.name}`,
      severity: rule.severity,
    }

    return await Notification.create({
      userId: campaign.userId,
      campaignId: campaign.id,
      type: rule.type,
      severity: template.severity,
      title: template.title,
      message: template.message,
      triggeredBy: rule.id,
      metadata: {
        ruleName: rule.name,
        campaignName: campaign.name,
        condition: rule.condition,
      },
    })
  }

  async checkCampaignHealth(campaignId) {
    const campaign = await Campaign.findByPk(campaignId)
    if (!campaign) return

    const rules = await AlertRule.findAll({
      where: { isEnabled: true },
    })

    for (const rule of rules) {
      const shouldTrigger = await this.checkCondition(rule, campaign)
      if (shouldTrigger) {
        await this.triggerNotification(rule, campaign)
      }
    }
  }
}

module.exports = NotificationEngine
