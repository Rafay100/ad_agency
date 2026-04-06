const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')
const { auth } = require('../middleware/auth')

router.use(auth)

router.get('/overview', analyticsController.getOverview)
router.get('/performance', analyticsController.getPerformance)
router.get('/demographics', analyticsController.getDemographics)
router.get('/export', analyticsController.exportReport)

module.exports = router
