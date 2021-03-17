const userModel = require('../models/user')
const response = require('../helpers/response')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { APP_KEY, APP_URL } = process.env
const sendEmail = require('../helpers/sendEmail')

exports.login = async (req, res) => {
  try {
    const { email } = req.body

    const initialResult = await userModel.getUser(email)

    if (initialResult.length < 1) {
      const pin = String(Math.random()).slice(2, 6)
      const salt = await bcrypt.genSalt()
      const encryptedPin = await bcrypt.hash(pin, salt)

      const data = {
        email,
        pin: encryptedPin
      }

      const createUser = await userModel.createUser(data)
      if (createUser.insertId > 0) {
        sendEmail(email, pin, 'Sinyal App PIN Code')
        const result = await userModel.getUser(email)
        return response(res, 200, true, 'User created successfully', result[0])
      }
      return response(res, 400, false, 'Cant create user')
    }

    // updatepin
    const pin = String(Math.random()).slice(2, 6)
    const salt = await bcrypt.genSalt()
    const encryptedPin = await bcrypt.hash(pin, salt)
    const updatePin = await userModel.updateUser(initialResult[0].id, { pin: encryptedPin })
    if (updatePin.affectedRows > 0) {
      sendEmail(email, pin, 'Sinyal App PIN Code')
      return response(res, 200, true, 'User Found successfully', { ...initialResult[0], pin: encryptedPin })
    }
    return response(res, 400, false, 'Bad Request')
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.confirmLogin = async (req, res) => {
  try {
    const data = req.body
    const initialResult = await userModel.getUser(data.email)
    if (initialResult.length > 0) {
      const compare = bcrypt.compareSync(data.pin, initialResult[0].pin)
      if (compare) {
        const { id, email, firstname, lastname, picture } = initialResult[0]
        const token = jwt.sign({ id, email, firstname, lastname, picture }, APP_KEY)
        const results = {
          token: token
        }
        return response(res, 200, true, 'Login succesfully', results)
      }
      return response(res, 401, false, 'Wrong Pin')
    }
    return response(res, 401, false, 'Email not registered')
  } catch (err) {
    return response(res, 400, false, 'Bad Request')
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { email } = req.userData
    const data = req.body

    const initialResults = await userModel.getUser(email)
    if (initialResults.length < 1) {
      return response(res, 404, false, 'User Not Found')
    }
    const id = initialResults[0].id

    console.log(req.file)
    if (req.file) {
      // const updatePicture = await userModel.updateUser(id, {picture: req.file.path})
      const picture = req.file.path
      const uploadImage = await userModel.updateUser(initialResults[0].id, { picture })
      if (uploadImage.affectedRows > 0) {
        if (initialResults[0].picture !== null) {
          fs.unlinkSync(`upload/profile/${initialResults[0].picture}`)
        }
        return response(res, 200, true, 'Image hash been Updated', { id, picture })
      }
      return response(res, 400, false, 'Cant update image')
    }

    const finalResult = await userModel.updateUser(id, data)
    if (finalResult.affectedRows > 0) {
      return response(res, 200, true, 'Personal Information has been updated', { ...initialResults[0], ...data })
    }
    return response(res, 400, false, 'Cant Update personal Information')
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}
