const { APP_URL } = process.env
const userModel = require('../models/user')
const response = require('../helpers/response')
const qs = require('querystring')

exports.getContact = async (req, res) => {
  try {
    const { id } = req.userData
    const cond = req.query
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 4
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'id'
    cond.order = cond.order || 'ASC'

    let totalPage
    let totalData

    if (cond.search) {
      totalData = await userModel.getCountContactByCondition(id, cond)
      totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)
    } else {
      totalData = await userModel.getCountContact(id, cond)
      totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)
    }

    const results = await userModel.getAllContactByCondition(id, cond)

    return response(
      res,
      200,
      true,
      'List of all Contact',
      results,
      {
        totalData: totalData[0].totalData,
        currentPage: cond.page,
        totalPage,
        nextLink: cond.page < totalPage ? `${APP_URL}contact?${qs.stringify({ ...req.query, ...{ page: cond.page + 1 } })}` : null,
        prevLink: cond.page > 1 ? `${APP_URL}contact?${qs.stringify({ ...req.query, ...{ page: cond.page - 1 } })}` : null
      }
    )
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}
