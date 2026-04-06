const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending',
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.TEXT,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
})

module.exports = Invoice
