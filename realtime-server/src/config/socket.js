const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token
      
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.sub
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    logger.info({ event: 'socket_connected', userId: socket.userId, socketId: socket.id })

    socket.join(`user:${socket.userId}`)

    socket.on('join:campaign', (campaignId) => {
      socket.join(`campaign:${campaignId}`)
      logger.info({ event: 'joined_campaign', userId: socket.userId, campaignId })
    })

    socket.on('leave:campaign', (campaignId) => {
      socket.leave(`campaign:${campaignId}`)
    })

    socket.on('campaign:update', (data) => {
      io.to(`campaign:${data.campaignId}`).emit('campaign:updated', data)
    })

    socket.on('campaign:status_change', (data) => {
      io.to(`campaign:${data.campaignId}`).emit('campaign:status_changed', {
        campaignId: data.campaignId,
        status: data.status,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('creative:generated', (data) => {
      io.to(`user:${socket.userId}`).emit('creative:ready', data)
    })

    socket.on('analytics:update', (data) => {
      io.to(`campaign:${data.campaignId}`).emit('analytics:updated', data)
    })

    socket.on('notification:send', ({ userId, notification }) => {
      io.to(`user:${userId}`).emit('notification:received', {
        ...notification,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('disconnect', () => {
      logger.info({ event: 'socket_disconnected', userId: socket.userId, socketId: socket.id })
    })
  })

  return io
}

module.exports = initializeSocket
