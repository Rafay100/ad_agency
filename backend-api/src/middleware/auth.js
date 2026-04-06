const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { User, RefreshToken } = require('../models')
const { UnauthorizedError, ForbiddenError } = require('../utils/errors')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required')
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findOne({
      where: { id: decoded.sub },
      attributes: { exclude: ['password_hash'] },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid or inactive user')
    }

    if (user.deletedAt) {
      throw new UnauthorizedError('User account deleted')
    }

    req.user = user
    req.tokenPayload = decoded
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Invalid or expired token'))
    } else {
      next(error)
    }
  }
}

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions')
    }
    next()
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.sub, {
      attributes: { exclude: ['password_hash'] },
    })

    if (user && user.isActive && !user.deletedAt) {
      req.user = user
    }
  } catch (error) {}
  
  next()
}

module.exports = { auth, requireRole, optionalAuth }
