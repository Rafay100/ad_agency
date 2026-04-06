const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const AlertRule = sequelize.define('AlertRule', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('ctr_low', 'budget_high', 'spend_rate', 'impressions_drop', 'custom'),
    allowNull: false,
  },
  condition: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('info', 'warning', 'critical'),
    defaultValue: 'warning',
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_enabled',
  },
  cooldownMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    field: 'cooldown_minutes',
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    field: 'last_triggered_at',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  indexes: [
    { fields: ['user_id', 'is_enabled'] },
    { fields: ['type'] },
  ],
})

module.exports = AlertRule
