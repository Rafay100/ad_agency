const { AlertRule } = require('../models')
const { ValidationError } = require('../utils/errors')

exports.getAll = async (req, res, next) => {
  try {
    const rules = await AlertRule.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    res.json({ success: true, data: { rules } })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, type, condition, severity, cooldownMinutes } = req.body

    const rule = await AlertRule.create({
      userId: req.user.id,
      name,
      type,
      condition,
      severity: severity || 'warning',
      cooldownMinutes: cooldownMinutes || 60,
    })

    res.status(201).json({ success: true, data: { rule } })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const rule = await AlertRule.findOne({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!rule) {
      return res.status(404).json({ success: false, error: { message: 'Rule not found' } })
    }

    await rule.update(req.body)
    res.json({ success: true, data: { rule } })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const rule = await AlertRule.findOne({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!rule) {
      return res.status(404).json({ success: false, error: { message: 'Rule not found' } })
    }
    await rule.destroy()
    res.json({ success: true, message: 'Rule deleted' })
  } catch (error) {
    next(error)
  }
}
