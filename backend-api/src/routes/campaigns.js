const express = require('express')
const router = express.Router()
const campaignController = require('../controllers/campaignController')
const { auth } = require('../middleware/auth')
const { paginate, filter, sort } = require('../middleware/query')
const validate = require('../middleware/validate')
const { createCampaignSchema, updateCampaignSchema, campaignQuerySchema } = require('../validations/campaign.validation')
const audit = require('../middleware/audit')

router.use(auth)
router.use(audit('campaign'))

router.get('/', 
  validate(campaignQuerySchema, 'query'),
  paginate,
  filter({
    status: 'eq',
    platform: 'eq',
    objective: 'eq',
    minBudget: 'gte',
    maxBudget: 'lte',
    startDateFrom: 'gte',
    startDateTo: 'lte',
    search: 'like',
  }),
  sort(['name', 'budget', 'spent', 'startDate', 'createdAt', 'updatedAt'], [['createdAt', 'DESC']]),
  campaignController.getAll
)

router.get('/stats', campaignController.getStats)
router.get('/:id', campaignController.getById)
router.post('/', validate(createCampaignSchema), campaignController.create)
router.put('/:id', validate(updateCampaignSchema), campaignController.update)
router.delete('/:id', campaignController.delete)
router.post('/:id/pause', campaignController.pause)
router.post('/:id/resume', campaignController.resume)

module.exports = router
