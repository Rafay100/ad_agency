const express = require('express')
const router = express.Router()
const alertRuleController = require('../controllers/alertRuleController')
const { auth } = require('../middleware/auth')

router.use(auth)

router.get('/', alertRuleController.getAll)
router.post('/', alertRuleController.create)
router.put('/:id', alertRuleController.update)
router.delete('/:id', alertRuleController.delete)

module.exports = router
