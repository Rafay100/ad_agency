const { Op, fn, col } = require('sequelize')
const { Analytics, Campaign } = require('../models')

exports.getOverview = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query
    const days = parseInt(range.replace('d', ''))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await Analytics.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
        },
      },
    })

    const totalSpend = analytics.reduce((sum, a) => sum + parseFloat(a.spend), 0)
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0)
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0)
    const totalConversions = analytics.reduce((sum, a) => sum + a.conversions, 0)

    const previousStart = new Date(startDate)
    previousStart.setDate(previousStart.getDate() - days)

    const previousAnalytics = await Analytics.findAll({
      where: {
        date: {
          [Op.gte]: previousStart,
          [Op.lt]: startDate,
        },
      },
    })

    const previousSpend = previousAnalytics.reduce((sum, a) => sum + parseFloat(a.spend), 0)
    const previousImpressions = previousAnalytics.reduce((sum, a) => sum + a.impressions, 0)
    const previousClicks = previousAnalytics.reduce((sum, a) => sum + a.clicks, 0)
    const previousConversions = previousAnalytics.reduce((sum, a) => sum + a.conversions, 0)

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 1 : 0
      return ((current - previous) / previous) * 100
    }

    res.json({
      totalSpend,
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      spendTrend: calculateTrend(totalSpend, previousSpend),
      impressionsTrend: calculateTrend(totalImpressions, previousImpressions),
      clicksTrend: calculateTrend(totalClicks, previousClicks),
      conversionsTrend: calculateTrend(totalConversions, previousConversions),
    })
  } catch (error) {
    next(error)
  }
}

exports.getPerformance = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query
    const days = parseInt(range.replace('d', ''))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const performance = await Analytics.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
        },
      },
      order: [['date', 'ASC']],
    })

    const campaigns = await Campaign.findAll({
      attributes: ['id', 'name', 'spent'],
      order: [['spent', 'DESC']],
      limit: 10,
    })

    res.json({
      data: performance.map(a => ({
        date: a.date,
        impressions: a.impressions,
        clicks: a.clicks,
        conversions: a.conversions,
        ctr: a.ctr,
        conversionRate: a.conversionRate,
      })),
      campaigns: campaigns.map(c => ({
        name: c.name,
        spend: parseFloat(c.spent),
      })),
    })
  } catch (error) {
    next(error)
  }
}

exports.getDemographics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query
    const days = parseInt(range.replace('d', ''))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await Analytics.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
        },
      },
    })

    const ageGroups = {}
    const regions = {}
    const channels = {}

    analytics.forEach(a => {
      if (a.demographics) {
        Object.entries(a.demographics.ageGroups || {}).forEach(([age, count]) => {
          ageGroups[age] = (ageGroups[age] || 0) + count
        })
        Object.entries(a.demographics.regions || {}).forEach(([region, count]) => {
          regions[region] = (regions[region] || 0) + count
        })
        Object.entries(a.demographics.channels || {}).forEach(([channel, count]) => {
          channels[channel] = (channels[channel] || 0) + count
        })
      }
    })

    res.json({
      ageGroups: Object.entries(ageGroups).map(([group, count]) => ({ group, count })),
      regions: Object.entries(regions).map(([region, value]) => ({ region, value })),
      channels: Object.entries(channels).map(([channel, value]) => ({ channel, value })),
    })
  } catch (error) {
    next(error)
  }
}

exports.exportReport = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query
    const days = parseInt(range.replace('d', ''))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await Analytics.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
        },
      },
      order: [['date', 'ASC']],
      include: [{ model: Campaign, as: 'campaign', attributes: ['name'] }],
    })

    let csv = 'Date,Campaign,Impressions,Clicks,Conversions,Spend,CTR,Conversion Rate\n'
    analytics.forEach(a => {
      csv += `${a.date},${a.campaign?.name || 'N/A'},${a.impressions},${a.clicks},${a.conversions},${a.spend},${a.ctr},${a.conversionRate}\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${range}.csv`)
    res.send(csv)
  } catch (error) {
    next(error)
  }
}
