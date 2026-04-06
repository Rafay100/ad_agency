const authService = require('../services/authService')
const { User } = require('../models')

exports.register = async (req, res, next) => {
  try {
    const data = {
      ...req.validatedBody,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }

    const result = await authService.register(data)
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const data = {
      ...req.validatedBody,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }

    const result = await authService.login(data)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const data = {
      ...req.validatedBody,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }

    const result = await authService.refresh(data)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    await authService.logout(refreshToken, req.ip)
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    })
    res.json({ success: true, data: { user } })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, company } = req.validatedBody
    const user = await User.findByPk(req.user.id)

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } })
      if (existing) {
        return res.status(409).json({
          success: false,
          error: { message: 'Email already in use' },
        })
      }
    }

    await user.update({ name, email, company })
    res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, company: user.company } } })
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validatedBody
    const user = await User.findByPk(req.user.id)

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error: { message: 'Current password is incorrect' },
      })
    }

    await user.update({ passwordHash: newPassword })
    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}
