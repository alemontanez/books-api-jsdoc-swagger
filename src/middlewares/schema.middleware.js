export const validateSchema = (schema) => (req, res, next) => {
  try {
    const res = schema.parse(req.body)
    req.body = res
    next()
  } catch (error) {
    return res.status(400).json({
      error: error.errors.map(error => error.message)
    })
  }
}