const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  company: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

const updateProfileSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
})

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
}
