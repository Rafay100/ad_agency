const express = require('express')
const router = express.Router()
const billingController = require('../controllers/billingController')
const { auth } = require('../middleware/auth')

router.use(auth)

router.get('/invoices', billingController.getInvoices)
router.post('/invoices', billingController.createInvoice)
router.get('/payment-methods', billingController.getPaymentMethods)
router.post('/payment-methods', billingController.addPaymentMethod)

module.exports = router
