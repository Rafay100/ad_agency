const express = require('express')
const router = express.Router()
const creativeController = require('../controllers/creativeController')
const { validateRequest } = require('../middleware/validate')
const { z } = require('zod')

const generateSchema = z.object({
  prompt: z.string().min(10),
  type: z.enum(['text', 'image', 'video']).optional(),
  tone: z.enum(['professional', 'casual', 'humorous', 'urgent']).optional(),
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok']).optional(),
})

router.post('/generate', validateRequest(generateSchema), creativeController.generate)

module.exports = router
