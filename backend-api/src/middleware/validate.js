const { ValidationError } = require('../utils/errors')

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params
      const validated = schema.parse(data)
      
      if (source === 'body') {
        req.validatedBody = validated
      } else if (source === 'query') {
        req.validatedQuery = validated
      } else {
        req.validatedParams = validated
      }
      
      next()
    } catch (error) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      next(new ValidationError('Invalid request data', errors))
    }
  }
}

module.exports = validate
