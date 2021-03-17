const routes = require('express').Router()
const contactController = require('../controllers/contact')
const authMiddleware = require('../middleware/auth')

routes.get('', authMiddleware.authCheck, contactController.getContact)

module.exports = routes
