const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Campaign = sequelize.define('Campaign', {
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
  clientId: {
    type: DataTypes.UUID,
    field: 'client_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255] },
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed', 'cancelled'),
    defaultValue: 'draft',
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  spent: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: { min: 0 },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
  },
  platform: {
    type: DataTypes.ENUM('google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'multi'),
    allowNull: false,
  },
  targeting: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  creative: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  objective: {
    type: DataTypes.ENUM('awareness', 'traffic', 'engagement', 'leads', 'conversions'),
    allowNull: false,
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      conversion_rate: 0,
      cpc: 0,
      cpa: 0,
    },
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
}, {
  paranoid: true,
  deletedAt: 'deletedAt',
})

module.exports = Campaign
