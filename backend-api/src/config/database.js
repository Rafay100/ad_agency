const { Sequelize } = require('sequelize')

const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ad_agency',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// Debug: Log environment variables (remove after fixing)
console.log('DB_HOST:', dbConfig.host)
console.log('DB_PORT:', dbConfig.port)
console.log('DB_NAME:', dbConfig.database)
console.log('DB_USER:', dbConfig.username)
console.log('DB_PASSWORD type:', typeof dbConfig.password, 'value:', dbConfig.password ? '***EXISTS***' : 'UNDEFINED/EMPTY')

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
})

module.exports = sequelize
