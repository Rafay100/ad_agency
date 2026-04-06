const campaignService = require('../services/campaignService')

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = req.pagination
    const filters = req.filters || {}
    const sort = req.sort || [['createdAt', 'DESC']]

    const result = await campaignService.getAll({
      pagination: { page, limit, offset },
      filters: {
        status: filters.status?.value,
        platform: filters.platform?.value,
        objective: filters.objective?.value,
        minBudget: filters.minBudget?.value,
        maxBudget: filters.maxBudget?.value,
        startDateFrom: filters.startDateFrom?.value,
        startDateTo: filters.startDateTo?.value,
        search: filters.search?.value,
      },
      sort,
      userId: req.user.id,
      role: req.user.role,
    })

    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const campaign = await campaignService.getById(req.params.id, req.user.id, req.user.role)
    res.json({ success: true, data: { campaign } })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const data = req.validatedBody || req.body
    const campaign = await campaignService.create(data, req.user.id)
    res.status(201).json({ success: true, data: { campaign } })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const data = req.validatedBody || req.body
    const campaign = await campaignService.update(req.params.id, data, req.user.id, req.user.role)
    res.json({ success: true, data: { campaign } })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await campaignService.softDelete(req.params.id, req.user.id, req.user.role)
    res.json({ success: true, message: 'Campaign deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.pause = async (req, res, next) => {
  try {
    const campaign = await campaignService.pause(req.params.id, req.user.id, req.user.role)
    res.json({ success: true, data: { campaign } })
  } catch (error) {
    next(error)
  }
}

exports.resume = async (req, res, next) => {
  try {
    const campaign = await campaignService.resume(req.params.id, req.user.id, req.user.role)
    res.json({ success: true, data: { campaign } })
  } catch (error) {
    next(error)
  }
}

exports.getStats = async (req, res, next) => {
  try {
    const stats = await campaignService.getStats(req.user.id, req.user.role)
    res.json({ success: true, data: { stats } })
  } catch (error) {
    next(error)
  }
}
