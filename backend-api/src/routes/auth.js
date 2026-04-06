const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { auth } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema, refreshTokenSchema, updateProfileSchema, changePasswordSchema } = require('../validations/auth.validation')
const audit = require('../middleware/audit')

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh', validate(refreshTokenSchema), authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', auth, authController.getMe)
router.put('/profile', auth, validate(updateProfileSchema), audit('user'), authController.updateProfile)
router.put('/password', auth, validate(changePasswordSchema), authController.changePassword)

module.exports = router
