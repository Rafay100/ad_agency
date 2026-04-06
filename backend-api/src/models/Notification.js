const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  type: {
    type: DataTypes.ENUM('ctr_low', 'budget_high', 'campaign_ended', 'milestone', 'custom'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('info', 'warning', 'critical'),
    defaultValue: 'info',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  campaignId: {
    type: DataTypes.UUID,
    field: 'campaign_id',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
  readAt: {
    type: DataTypes.DATE,
    field: 'read_at',
  },
  triggeredBy: {
    type: DataTypes.STRING,
    field: 'triggered_by',
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
}, {
  paranoid: true,
  deletedAt: 'deletedAt',
  indexes: [
    { fields: ['user_id', 'is_read'] },
    { fields: ['user_id', 'created_at'] },
    { fields: ['campaign_id'] },
    { fields: ['type'] },
  ],
})

module.exports = Notification
