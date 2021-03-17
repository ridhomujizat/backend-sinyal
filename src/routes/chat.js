const routes = require('express').Router()
const chatController = require('../controllers/chat')
const authMiddleware = require('../middleware/auth')

routes.get('', authMiddleware.authCheck, chatController.chatList)
routes.get('/:idUser', authMiddleware.authCheck, chatController.RoomChat)
routes.post('/:idUser', authMiddleware.authCheck, chatController.sendChat)

module.exports = routes
