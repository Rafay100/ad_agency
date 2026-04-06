const { Op } = require('sequelize')
const { Client } = require('../models')

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = req.pagination
    const { search } = req.query

    const where = {}
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
      ]
    }

    const { count, rows: clients } = await Client.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })

    res.json({
      clients,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id)

    if (!client) {
      return res.status(404).json({ error: 'Client not found' })
    }

    res.json({ client })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const client = await Client.create(req.body)
    res.status(201).json({ client })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id)

    if (!client) {
      return res.status(404).json({ error: 'Client not found' })
    }

    await client.update(req.body)
    res.json({ client })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id)

    if (!client) {
      return res.status(404).json({ error: 'Client not found' })
    }

    await client.destroy()
    res.json({ message: 'Client deleted successfully' })
  } catch (error) {
    next(error)
  }
}
