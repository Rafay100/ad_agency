const User = require('./User')
const Campaign = require('./Campaign')
const Client = require('./Client')
const Creative = require('./Creative')
const Analytics = require('./Analytics')
const Invoice = require('./Invoice')
const RefreshToken = require('./RefreshToken')
const AuditLog = require('./AuditLog')
const Notification = require('./Notification')
const AlertRule = require('./AlertRule')

User.hasMany(Campaign, { foreignKey: 'userId', as: 'campaigns' })
Campaign.belongsTo(User, { foreignKey: 'userId', as: 'owner' })

Client.hasMany(Campaign, { foreignKey: 'clientId', as: 'campaigns' })
Campaign.belongsTo(Client, { foreignKey: 'clientId', as: 'client' })

User.hasMany(Creative, { foreignKey: 'userId', as: 'creatives' })
Creative.belongsTo(User, { foreignKey: 'userId', as: 'creator' })

Campaign.hasMany(Creative, { foreignKey: 'campaignId', as: 'campaignCreatives' })
Creative.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' })

Campaign.hasMany(Analytics, { foreignKey: 'campaignId', as: 'analytics' })
Analytics.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' })

Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' })
Invoice.belongsTo(Client, { foreignKey: 'clientId', as: 'client' })

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' })
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' })
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Campaign.hasMany(Notification, { foreignKey: 'campaignId', as: 'campaignNotifications' })
Notification.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' })

User.hasMany(AlertRule, { foreignKey: 'userId', as: 'alertRules' })
AlertRule.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  User,
  Campaign,
  Client,
  Creative,
  Analytics,
  Invoice,
  RefreshToken,
  AuditLog,
  Notification,
  AlertRule,
}
