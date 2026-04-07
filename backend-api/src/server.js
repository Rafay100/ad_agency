require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const cors = require('./config/cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimiter = require('./config/rateLimiter')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./config/logger')
const sequelize = require('./config/database')
const NotificationEngine = require('./services/notificationEngine')

const authRoutes = require('./routes/auth')
const campaignRoutes = require('./routes/campaigns')
const clientRoutes = require('./routes/clients')
// const creativeRoutes = require('./routes/creatives') // Temporarily disabled
const analyticsRoutes = require('./routes/analytics')
const billingRoutes = require('./routes/billing')
const notificationRoutes = require('./routes/notifications')
const alertRuleRoutes = require('./routes/alertRules')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token
    if (!token) return next(new Error('Authentication error'))
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.sub
    next()
  } catch {
    next(new Error('Authentication error'))
  }
})

io.on('connection', (socket) => {
  logger.info({ event: 'socket_connected', userId: socket.userId, socketId: socket.id })
  socket.join(`user:${socket.userId}`)

  socket.on('disconnect', () => {
    logger.info({ event: 'socket_disconnected', userId: socket.userId, socketId: socket.id })
  })
})

const notificationEngine = new NotificationEngine(io)

setInterval(() => {
  notificationEngine.evaluateAll().catch(err => {
    logger.error({ event: 'notification_engine_error', error: err.message })
  })
}, 60000)

app.use(helmet())
app.use(cors)
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use('/api', rateLimiter)

app.use('/api/health', (req, res) => res.json({ success: true, timestamp: new Date().toISOString() }))
app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/clients', clientRoutes)
// app.use('/api/creative', creativeRoutes) // Temporarily disabled
app.use('/api/analytics', analyticsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/alert-rules', alertRuleRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000

const start = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connection established')
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    logger.info('Database synchronized')
  } catch (error) {
    logger.error(`Database connection/sync failed: ${error.message}`)
    logger.error(`Full error: ${JSON.stringify({ code: error.code, original: error.original?.message, parent: error.parent?.message })}`)
    logger.warn('Server will start without database. Check database configuration.')
  }

  try {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()

module.exports = { app, server, io, notificationEngine }
