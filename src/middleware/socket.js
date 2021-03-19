module.exports = (io) => {
  return (req, res, next) => {
    req.socket = io
    next()
  }
}
