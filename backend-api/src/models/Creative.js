const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Creative = sequelize.define('Creative', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'video'),
    allowNull: false,
  },
  tone: {
    type: DataTypes.ENUM('professional', 'casual', 'humorous', 'urgent'),
    allowNull: false,
  },
  platform: {
    type: DataTypes.ENUM('google', 'facebook', 'instagram', 'linkedin', 'tiktok'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'revised'),
    defaultValue: 'pending',
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
})

module.exports = Creative
