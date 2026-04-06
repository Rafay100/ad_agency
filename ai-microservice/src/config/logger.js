const winston = require('winston')
const { randomUUID } = require('crypto')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'ai-microservice' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
          const req = requestId ? ` [${requestId}]` : ''
          const m = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
          return `${timestamp} ${level}${req} ${message}${m}`
        })
      ),
    })
  )
}

const attachRequestId = (req, res, next) => {
  req.requestId = randomUUID()
  req.logger = logger.child({ requestId: req.requestId })
  next()
}

module.exports = { logger, attachRequestId }
