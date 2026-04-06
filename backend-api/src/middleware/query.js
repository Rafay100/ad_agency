const paginate = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
  const offset = (page - 1) * limit

  req.pagination = { page, limit, offset }
  next()
}

const filter = (allowedFields = {}) => {
  return (req, res, next) => {
    const filters = {}
    
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('filter[')) {
        const field = key.replace('filter[', '').replace(']', '')
        if (allowedFields[field]) {
          filters[field] = {
            value: req.query[key],
            operator: allowedFields[field],
          }
        }
      }
    })

    req.filters = filters
    next()
  }
}

const sort = (allowedFields = [], defaultSort = [['createdAt', 'DESC']]) => {
  return (req, res, next) => {
    if (!req.query.sort) {
      req.sort = defaultSort
      return next()
    }

    const sortParams = req.query.sort.split(',').map(param => {
      const trimmed = param.trim()
      const isDesc = trimmed.startsWith('-')
      const field = isDesc ? trimmed.substring(1) : trimmed
      
      if (!allowedFields.includes(field)) {
        return null
      }
      
      return [field, isDesc ? 'DESC' : 'ASC']
    }).filter(Boolean)

    req.sort = sortParams.length > 0 ? sortParams : defaultSort
    next()
  }
}

module.exports = { paginate, filter, sort }
