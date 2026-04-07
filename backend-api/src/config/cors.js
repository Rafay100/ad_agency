const cors = require('cors')

const corsOptions = {
  // Accept ALL origins - restrict later if needed
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 3600,
}

module.exports = cors(corsOptions)
