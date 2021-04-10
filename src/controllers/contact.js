const userModel = require('../models/user')
const response = require('../helpers/response')
const qs = require('querystring')

exports.getContact = async (req, res) => {
  try {
    const { id } = req.userData
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
    cond.sort = cond.sort || 'firstName'
    cond.order = cond.order || 'ASC'

    const totalData = await userModel.getCountContactByCondition(id, cond)
    const totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)
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
