const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { User, RefreshToken } = require('../models')
const { UnauthorizedError, BadRequestError, ConflictError } = require('../utils/errors')
const logger = require('../config/logger')

const generateTokens = (user) => {
  const payload = { sub: user.id, role: user.role }
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })
  
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  })
  
  return { accessToken, refreshToken }
}

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

class AuthService {
  async register(data) {
    const existingUser = await User.findOne({ where: { email: data.email } })
    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      company: data.company,
    })

    const { accessToken, refreshToken } = generateTokens(user)
    await this.storeRefreshToken(user.id, refreshToken, data.ip, data.userAgent)

    logger.info({ event: 'user_registered', userId: user.id })

    return {
      user: { id: user.id, name: user.name, email: user.email, company: user.company, role: user.role },
      accessToken,
      refreshToken,
    }
  }

  async login(data) {
    const user = await User.findOne({ where: { email: data.email } })
    if (!user || !(await user.comparePassword(data.password))) {
      throw new UnauthorizedError('Invalid credentials')
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated')
    }

    await user.update({ lastLoginAt: new Date() })
    const { accessToken, refreshToken } = generateTokens(user)
    await this.storeRefreshToken(user.id, refreshToken, data.ip, data.userAgent)

    logger.info({ event: 'user_logged_in', userId: user.id })

    return {
      user: { id: user.id, name: user.name, email: user.email, company: user.company, role: user.role },
      accessToken,
      refreshToken,
    }
  }

  async refresh(data) {
    const tokenHash = hashToken(data.refreshToken)
    const storedToken = await RefreshToken.findOne({
      where: { tokenHash },
      include: [{ model: User, as: 'user' }],
    })

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    if (storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      await storedToken.update({ revokedAt: new Date() })
      throw new UnauthorizedError('Refresh token expired or revoked')
    }

    const user = storedToken.user
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated')
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)
    await storedToken.update({ revokedAt: new Date() })
    await this.storeRefreshToken(user.id, newRefreshToken, data.ip, data.userAgent)

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken, ip) {
    const tokenHash = hashToken(refreshToken)
    const storedToken = await RefreshToken.findOne({ where: { tokenHash } })
    
    if (storedToken) {
      await storedToken.update({ revokedAt: new Date() })
    }

    logger.info({ event: 'user_logged_out', ip })
  }

  async revokeAllUserTokens(userId) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId, revokedAt: null } }
    )
  }

  async storeRefreshToken(userId, token, ip, userAgent) {
    const tokenHash = hashToken(token)
    const decoded = jwt.decode(token)
    
    await RefreshToken.create({
      userId,
      tokenHash,
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress: ip,
      userAgent,
    })
  }
}

module.exports = new AuthService()
