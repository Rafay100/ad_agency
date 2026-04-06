require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const initializeSocket = require('./config/socket')
const logger = require('./config/logger')

const app = express()
const server = http.createServer(app)

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(morgan('combined'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const io = initializeSocket(server)

const PORT = process.env.PORT || 4001

server.listen(PORT, () => {
  logger.info(`Realtime Server running on port ${PORT}`)
})

module.exports = { app, server, io }
