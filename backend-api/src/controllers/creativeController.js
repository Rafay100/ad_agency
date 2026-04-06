const axios = require('axios')
const { Creative } = require('../models')

exports.generate = async (req, res, next) => {
  try {
    const { prompt, type, tone, platform } = req.body

    const response = await axios.post(`${process.env.AI_SERVICE_URL}/generate`, {
      prompt,
      type,
      tone,
      platform,
    })

    const creative = await Creative.create({
      prompt,
      content: response.data.content,
      type,
      tone,
      platform,
      userId: req.user.id,
      metadata: response.data.metadata,
    })

    res.status(201).json({ creative })
  } catch (error) {
    next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    const creatives = await Creative.findAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    })

    res.json({ creatives })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const creative = await Creative.findByPk(req.params.id)

    if (!creative) {
      return res.status(404).json({ error: 'Creative not found' })
    }

    res.json({ creative })
  } catch (error) {
    next(error)
  }
}

exports.approve = async (req, res, next) => {
  try {
    const creative = await Creative.findByPk(req.params.id)

    if (!creative) {
      return res.status(404).json({ error: 'Creative not found' })
    }

    await creative.update({ status: 'approved' })
    res.json({ creative })
  } catch (error) {
    next(error)
  }
}

exports.reject = async (req, res, next) => {
  try {
    const { feedback } = req.body
    const creative = await Creative.findByPk(req.params.id)

    if (!creative) {
      return res.status(404).json({ error: 'Creative not found' })
    }

    await creative.update({ status: 'rejected', feedback })
    res.json({ creative })
  } catch (error) {
    next(error)
  }
}
