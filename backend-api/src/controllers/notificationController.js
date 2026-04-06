const { Op } = require('sequelize')
const { Notification, Campaign } = require('../models')

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly, type } = req.query
    const offset = (page - 1) * limit

    const where = { userId: req.user.id, deletedAt: null }
    if (unreadOnly === 'true') where.isRead = false
    if (type) where.type = type

    const { count, rows } = await Notification.findAndCountAll({
      where,
      include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'name', 'status'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    })

    res.json({
      success: true,
      data: {
        notifications: rows,
        pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false, deletedAt: null },
    })
    res.json({ success: true, data: { unreadCount: count } })
  } catch (error) {
    next(error)
  }
}

exports.markAsRead = async (req, res, next) => {
  try {
    const { ids } = req.body

    if (ids && ids.length > 0) {
      await Notification.update(
        { isRead: true, readAt: new Date() },
        { where: { id: ids, userId: req.user.id } }
      )
    } else {
      const notification = await Notification.findOne({
        where: { id: req.params.id, userId: req.user.id },
      })
      if (!notification) {
        return res.status(404).json({ success: false, error: { message: 'Notification not found' } })
      }
      await notification.update({ isRead: true, readAt: new Date() })
    }

    res.json({ success: true, message: 'Notification(s) marked as read' })
  } catch (error) {
    next(error)
  }
}

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId: req.user.id, isRead: false } }
    )
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!notification) {
      return res.status(404).json({ success: false, error: { message: 'Notification not found' } })
    }
    await notification.destroy()
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    next(error)
  }
}
