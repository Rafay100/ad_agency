const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  changes: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  ipAddress: {
    type: DataTypes.INET,
  },
  userAgent: {
    type: DataTypes.TEXT,
  },
})

module.exports = AuditLog
