const { z } = require('zod')

const copySchema = z.object({
  product: z.string().min(1).max(500),
  description: z.string().min(10).max(2000),
  audience: z.string().min(5).max(500),
  tone: z.enum(['professional', 'casual', 'humorous', 'urgent', 'inspirational', 'educational']).default('professional'),
  format: z.enum(['headline', 'description', 'email', 'landing_page', 'full_ad']).default('full_ad'),
  count: z.coerce.number().int().min(1).max(5).default(3),
  language: z.string().min(2).max(5).default('en'),
})

const socialSchema = z.object({
  product: z.string().min(1).max(500),
  message: z.string().min(10).max(2000),
  platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok']),
  audience: z.string().min(5).max(500).optional(),
  tone: z.enum(['professional', 'casual', 'humorous', 'urgent', 'inspirational', 'educational']).default('casual'),
  includeHashtags: z.coerce.boolean().default(true),
  includeEmojis: z.coerce.boolean().default(true),
  count: z.coerce.number().int().min(1).max(5).default(3),
})

const hashtagSchema = z.object({
  topic: z.string().min(1).max(500),
  niche: z.string().min(1).max(200).optional(),
  platform: z.enum(['instagram', 'twitter', 'tiktok', 'linkedin', 'all']).default('instagram'),
  count: z.coerce.number().int().min(5).max(50).default(20),
  exclude: z.array(z.string()).optional(),
})

module.exports = { copySchema, socialSchema, hashtagSchema }
