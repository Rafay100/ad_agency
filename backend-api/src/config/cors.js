const cors = require('cors')

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)

    // Allow all origins temporarily for debugging
    // TODO: Restrict this in production
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean)

    // Also allow any vercel.app or onrender.com domain
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS. Requested origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 3600,
}

module.exports = cors(corsOptions)
