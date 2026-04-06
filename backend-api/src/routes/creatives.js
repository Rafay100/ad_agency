const express = require('express')
const router = express.Router()
const creativeController = require('../controllers/creativeController')
const { auth } = require('../middleware/auth')

router.use(auth)

router.get('/', creativeController.getAll)
router.get('/:id', creativeController.getById)
router.post('/generate', creativeController.generate)
router.post('/:id/approve', creativeController.approve)
router.post('/:id/reject', creativeController.reject)

module.exports = router
