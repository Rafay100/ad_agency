const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  tokenHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revokedAt: {
    type: DataTypes.DATE,
  },
  ipAddress: {
    type: DataTypes.INET,
  },
  userAgent: {
    type: DataTypes.TEXT,
  },
})

module.exports = RefreshToken
