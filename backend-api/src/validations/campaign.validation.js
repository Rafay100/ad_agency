const { z } = require('zod')

const campaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  budget: z.number().positive(),
  spent: z.number().nonnegative().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'multi']),
  objective: z.enum(['awareness', 'traffic', 'engagement', 'leads', 'conversions']),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).optional(),
  clientId: z.string().uuid().optional().nullable(),
  targeting: z.record(z.unknown()).optional(),
  creative: z.record(z.unknown()).optional(),
})

const createCampaignSchema = campaignSchema.omit({ spent: true })

const updateCampaignSchema = campaignSchema.partial()

const campaignQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
  'filter[status]': z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).optional(),
  'filter[platform]': z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'multi']).optional(),
  'filter[objective]': z.enum(['awareness', 'traffic', 'engagement', 'leads', 'conversions']).optional(),
  'filter[search]': z.string().optional(),
  'filter[minBudget]': z.coerce.number().optional(),
  'filter[maxBudget]': z.coerce.number().optional(),
  'filter[startDateFrom]': z.coerce.date().optional(),
  'filter[startDateTo]': z.coerce.date().optional(),
})

module.exports = {
  campaignSchema,
  createCampaignSchema,
  updateCampaignSchema,
  campaignQuerySchema,
}
