require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const { logger, attachRequestId } = require('./config/logger')
const generateRoutes = require('./routes/generate')

const app = express()

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Rate limit exceeded. Please try again later.' } },
})

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173']

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '1mb' }))
app.use(attachRequestId)
app.use(limiter)
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
  skip: (req) => req.path === '/health',
}))

app.use('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
  })
})

app.use('/generate', generateRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.method} ${req.originalUrl} not found` },
  })
})

app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid JSON in request body' },
    })
  }

  if (err.name === 'OpenAIError') {
    req.logger.error({ event: 'openai_error', error: err.message, status: err.status })
    return res.status(502).json({
      success: false,
      error: { message: 'AI service unavailable. Please try again.' },
    })
  }

  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: { message: 'OpenAI rate limit exceeded' },
    })
  }

  req.logger.error({
    event: 'unhandled_error',
    error: err.message,
    stack: err.stack,
  })

  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  logger.info(`AI Microservice running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})

module.exports = app
