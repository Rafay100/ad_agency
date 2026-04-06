const validate = (schema) => (req, res, next) => {
  try {
    req.validatedBody = schema.parse(req.body)
    next()
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))
    res.status(422).json({
      success: false,
      error: { message: 'Validation failed', details: errors },
    })
  }
}

const sseHeaders = (res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()
}

module.exports = { validate, sseHeaders }
