const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [2, 255] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash',
  },
  company: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'analyst', 'viewer'),
    defaultValue: 'viewer',
  },
  avatarUrl: {
    type: DataTypes.STRING,
    field: 'avatar_url',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at',
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    field: 'email_verified_at',
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },
}, {
  paranoid: true,
  deletedAt: 'deletedAt',
})

User.beforeCreate(async (user) => {
  if (user.passwordHash) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
  }
})

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 12)
  }
})

User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.passwordHash
  delete values.deletedAt
  return values
}

module.exports = User
