const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { auth } = require('../middleware/auth')
const paginate = require('../middleware/paginate')

router.use(auth)
router.use(paginate)

router.get('/', clientController.getAll)
router.get('/:id', clientController.getById)
router.post('/', clientController.create)
router.put('/:id', clientController.update)
router.delete('/:id', clientController.delete)

module.exports = router
