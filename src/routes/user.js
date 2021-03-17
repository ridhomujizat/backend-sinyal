const routes = require('express').Router()
const userControler = require('../controllers/user')
const token = require('../middleware/auth')
const uploadImage = require('../middleware/uploadProfile')

routes.post('', userControler.login)
routes.patch('', token.authCheck, uploadImage, userControler.updateUser)
routes.post('/login', userControler.confirmLogin)

module.exports = routes
