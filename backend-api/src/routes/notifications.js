const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')
const { auth } = require('../middleware/auth')

router.use(auth)

router.get('/', notificationController.getAll)
router.get('/unread-count', notificationController.getUnreadCount)
router.post('/mark-read', notificationController.markAsRead)
router.post('/mark-all-read', notificationController.markAllAsRead)
router.delete('/:id', notificationController.delete)

module.exports = router
