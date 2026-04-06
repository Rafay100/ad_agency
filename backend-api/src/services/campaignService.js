const { Op } = require('sequelize')
const { Campaign, User, Client } = require('../models')
const { NotFoundError, BadRequestError } = require('../utils/errors')
const logger = require('../config/logger')

class CampaignService {
  async getAll({ pagination, filters, sort, userId, role }) {
    const where = { deletedAt: null }
    
    if (role !== 'admin') {
      where.userId = userId
    }

    if (filters.status) {
      where.status = filters.status
    }
    if (filters.platform) {
      where.platform = filters.platform
    }
    if (filters.objective) {
      where.objective = filters.objective
    }
    if (filters.minBudget || filters.maxBudget) {
      where.budget = {}
      if (filters.minBudget) where.budget.gte = filters.minBudget
      if (filters.maxBudget) where.budget.lte = filters.maxBudget
    }
    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {}
      if (filters.startDateFrom) where.startDate.gte = filters.startDateFrom
      if (filters.startDateTo) where.startDate.lte = filters.startDateTo
    }
    if (filters.search) {
      where.name = { [Op.iLike]: `%${filters.search}%` }
    }

    const { count, rows } = await Campaign.findAndCountAll({
      where,
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'company'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
      order: sort,
      limit: pagination.limit,
      offset: pagination.offset,
    })

    return {
      campaigns: rows,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
        totalPages: Math.ceil(count / pagination.limit),
      },
    }
  }

  async getById(id, userId, role) {
    const campaign = await Campaign.findByPk(id, {
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'company'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    })

    if (!campaign) {
      throw new NotFoundError('Campaign not found')
    }

    if (role !== 'admin' && campaign.userId !== userId) {
      throw new BadRequestError('Campaign not found')
    }

    return campaign
  }

  async create(data, userId) {
    const campaign = await Campaign.create({
      ...data,
      userId,
    })

    logger.info({ event: 'campaign_created', campaignId: campaign.id, userId })
    return campaign
  }

  async update(id, data, userId, role) {
    const campaign = await this.getById(id, userId, role)

    if (campaign.status === 'completed' || campaign.status === 'cancelled') {
      throw new BadRequestError('Cannot update completed or cancelled campaign')
    }

    await campaign.update(data)
    logger.info({ event: 'campaign_updated', campaignId: id, userId })
    return campaign
  }

  async softDelete(id, userId, role) {
    const campaign = await this.getById(id, userId, role)
    
    if (campaign.status === 'active') {
      throw new BadRequestError('Cannot delete active campaign. Pause it first.')
    }

    await campaign.destroy()
    logger.info({ event: 'campaign_soft_deleted', campaignId: id, userId })
    return campaign
  }

  async pause(id, userId, role) {
    const campaign = await this.getById(id, userId, role)
    
    if (campaign.status !== 'active') {
      throw new BadRequestError('Campaign must be active to pause')
    }

    await campaign.update({ status: 'paused' })
    logger.info({ event: 'campaign_paused', campaignId: id, userId })
    return campaign
  }

  async resume(id, userId, role) {
    const campaign = await this.getById(id, userId, role)
    
    if (campaign.status !== 'paused') {
      throw new BadRequestError('Campaign must be paused to resume')
    }

    await campaign.update({ status: 'active' })
    logger.info({ event: 'campaign_resumed', campaignId: id, userId })
    return campaign
  }

  async getStats(userId, role) {
    const where = { deletedAt: null }
    if (role !== 'admin') where.userId = userId

    const stats = await Campaign.findAll({
      where,
      attributes: [
        'status',
        [Campaign.sequelize.fn('count', Campaign.sequelize.col('id')), 'count'],
        [Campaign.sequelize.fn('sum', Campaign.sequelize.col('budget')), 'total_budget'],
        [Campaign.sequelize.fn('sum', Campaign.sequelize.col('spent')), 'total_spent'],
      ],
      group: ['status'],
    })

    return stats.map(s => s.toJSON())
  }
}

module.exports = new CampaignService()
