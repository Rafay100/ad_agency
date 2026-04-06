const logger = require('../config/logger')
const { AppError } = require('../utils/errors')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  if (process.env.NODE_ENV === 'development') {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, {
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    })
  } else {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, {
      errorId: err.id,
      userId: req.user?.id,
    })
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }))
    error = new (require('../utils/errors').ValidationError)('Validation failed', errors)
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'unknown'
    error = new (require('../utils/errors').ConflictError)(`${field} must be unique`)
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = new (require('../utils/errors').BadRequestError)('Invalid reference to related resource')
  }

  if (err.name === 'JsonWebTokenError') {
    error = new (require('../utils/errors').UnauthorizedError)('Invalid token')
  }

  if (err.name === 'TokenExpiredError') {
    error = new (require('../utils/errors').UnauthorizedError)('Token expired')
  }

  const statusCode = error.statusCode || err.statusCode || 500
  const message = error.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(error.errors && { details: error.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

module.exports = errorHandler
