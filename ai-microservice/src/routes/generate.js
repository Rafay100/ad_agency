const express = require('express')
const router = express.Router()
const generationController = require('../controllers/generationController')
const { validate } = require('../middleware')
const { copySchema, socialSchema, hashtagSchema } = require('../validations')

router.post('/copy', validate(copySchema), generationController.generateCopy)
router.post('/copy/stream', validate(copySchema), generationController.generateCopyStream)
router.post('/social', validate(socialSchema), generationController.generateSocial)
router.post('/hashtags', validate(hashtagSchema), generationController.generateHashtags)

module.exports = router
