const response = require('../helpers/response')
const chatModel = require('../models/chat')
const userModel = require('../models/user')
const qs = require('querystring')

exports.chatList = async (req, res) => {
  try {
    const { id } = req.userData
    console.log(id)
    const cond = req.query
    const query = qs.stringify({
      limit: cond.limit,
      offset: cond.offset,
      sort: cond.sort,
      order: cond.order
    })
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 10
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'createdAt'
    cond.order = cond.order || 'DESC'

    const results = await chatModel.getChatHistory(id, cond)
    const totalData = await chatModel.getCountChatHistory(id, cond)
    const totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)
    // return response(res, 200, true, 'Chat List',
    //   results.reduce((value, item) => {
    //     // const index = .findIndex(x => x.idUser ==="yutu");
    //     if (value.findIndex(x => x.idUser === item.idUser) === -1) {
    //       value.push(item)
    //     } else {
    //       const index = value.findIndex(x => x.idUser === item.idUser)
    //       value[index] = item
    //     }
    //     return value
    //   }, []))
    return response(
      res,
      200,
      true,
      'List History Chat',
      results,
      {
        totalData: totalData[0].totalData,
        currentPage: cond.page,
        totalPage,

        nextLink: (cond.search.length > 0
          ? (cond.page < totalPage ? `page=${cond.page + 1}&search=${cond.search}&${query}` : null)
          : (cond.page < totalPage ? `page=${cond.page + 1}&${query}` : null)),
        prevLink: (cond.search.length > 0
          ? (cond.page > 1 ? `page=${cond.page - 1}&search=${cond.search}&${query}` : null)
          : (cond.page > 1 ? `page=${cond.page - 1}&${query}` : null))
      }
    )
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.RoomChat = async (req, res) => {
  try {
    const { id } = req.userData
    const { idUser } = req.params
    const cond = req.query
    const query = qs.stringify({
      limit: cond.limit,
      offset: cond.offset,
      sort: cond.sort,
      order: cond.order
    })
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 10
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'id'
    cond.order = cond.order || 'DESC'

    const results = await chatModel.getChatList(id, idUser, cond)
    const totalData = await chatModel.getCountChatList(id, idUser, cond)
    const totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)

    return response(
      res,
      200,
      true,
      'History Chat',
      results,
      {
        totalData: totalData[0].totalData,
        currentPage: cond.page,
        totalPage,
        nextLink: (cond.search.length > 0
          ? (cond.page < totalPage ? `page=${cond.page + 1}&search=${cond.search}&${query}` : null)
          : (cond.page < totalPage ? `page=${cond.page + 1}&${query}` : null)),
        prevLink: (cond.search.length > 0
          ? (cond.page > 1 ? `page=${cond.page - 1}&search=${cond.search}&${query}` : null)
          : (cond.page > 1 ? `page=${cond.page - 1}&${query}` : null))
      }
    )
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.sendChat = async (req, res) => {
  try {
    const { idUser } = req.params
    const { id } = req.userData
    const data = req.body

    console.log(data)
    const initialResult = await userModel.getUsersByCondition({ id: idUser })

    if (initialResult.length > 0) {
      await chatModel.changeLastChat(id, idUser)
      const results = await chatModel.sendChat({ idSender: id, idReceiver: idUser, chat: data.chat })
      if (results.insertId > 0) {
        console.log(results)
        console.log(req.socket.emit(idUser, results), 'test')
        req.socket.emit(idUser, results)
        return response(res, 200, true, 'Successfully sent the message')
      }
      return response(res, 400, 'Failed to send message')
    }
    return response(res, 400, false, 'Bad Request')
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}
