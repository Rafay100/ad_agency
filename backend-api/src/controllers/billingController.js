const { Invoice } = require('../models')

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.findAll({
      order: [['issueDate', 'DESC']],
    })

    res.json({ invoices })
  } catch (error) {
    next(error)
  }
}

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body)
    res.status(201).json({ invoice })
  } catch (error) {
    next(error)
  }
}

exports.getPaymentMethods = async (req, res, next) => {
  try {
    res.json({ paymentMethods: [] })
  } catch (error) {
    next(error)
  }
}

exports.addPaymentMethod = async (req, res, next) => {
  try {
    res.status(201).json({ paymentMethod: req.body })
  } catch (error) {
    next(error)
  }
}
