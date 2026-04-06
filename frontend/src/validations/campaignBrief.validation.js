import { z } from 'zod'

export const clientDetailsSchema = z.object({
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  targetAudience: z.string().min(10, 'Please describe your target audience (min 10 chars)'),
  budget: z.coerce.number().min(100, 'Minimum budget is $100'),
})

export const campaignObjectiveSchema = z.object({
  campaignName: z.string().min(3, 'Campaign name must be at least 3 characters'),
  objective: z.enum(['awareness', 'traffic', 'engagement', 'leads', 'conversions', 'sales']),
  keyMessage: z.string().min(10, 'Key message must be at least 10 characters'),
  uniqueSellingPoint: z.string().min(10, 'USP must be at least 10 characters'),
  targetRegions: z.array(z.string()).min(1, 'Select at least one region'),
  campaignDuration: z.enum(['2weeks', '1month', '3months', '6months', 'ongoing']),
})

export const creativePreferencesSchema = z.object({
  tone: z.enum(['professional', 'casual', 'humorous', 'urgent', 'inspirational', 'educational']),
  channels: z.array(z.string()).min(1, 'Select at least one channel'),
  brandColors: z.string().optional(),
  visualStyle: z.enum(['minimal', 'bold', 'corporate', 'playful', 'luxury', 'retro']),
  competitors: z.string().optional(),
  additionalNotes: z.string().optional(),
})

export const reviewSchema = z.object({
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to proceed' }) }),
})

export const campaignBriefSchema = clientDetailsSchema
  .merge(campaignObjectiveSchema)
  .merge(creativePreferencesSchema)
