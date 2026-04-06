const audit = (entityType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res)
    
    res.json = async (body) => {
      try {
        if (body && req.user) {
          const logEntry = {
            userId: req.user.id,
            action: `${entityType}.${req.method.toLowerCase() === 'post' ? 'create' : req.method.toLowerCase() === 'put' ? 'update' : req.method.toLowerCase() === 'delete' ? 'delete' : 'read'}`,
            entityType,
            entityId: body.campaign?.id || body.creative?.id || body.client?.id || req.params.id,
            changes: {
              method: req.method,
              path: req.originalUrl,
              ...(req.method !== 'GET' && { requestBody: req.body }),
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          }

          const { AuditLog } = require('../models')
          await AuditLog.create(logEntry).catch(() => {})
        }
      } catch (error) {}

      return originalJson(body)
    }

    next()
  }
}

module.exports = audit
