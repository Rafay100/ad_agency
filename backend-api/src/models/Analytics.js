const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  campaignId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  conversions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  spend: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0,
  },
  conversionRate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0,
  },
  cpc: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0,
  },
  cpa: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0,
  },
  demographics: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
})

module.exports = Analytics
