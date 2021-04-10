const userModel = require('../models/user')
const response = require('../helpers/response')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { APP_KEY } = process.env
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
        console.log(pin)
        sendEmail(email, pin, 'Sinyal App PIN Code')
        const results = await userModel.getUser(email)
        return response(res, 200, true, 'User created successfully',
          {
            id: results[0].id,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            picture: results[0].picture,
            email: results[0].email

          })
      }
      return response(res, 400, false, 'Cant create user')
    }

    // updatepin
    const pin = String(Math.random()).slice(2, 6)
    const salt = await bcrypt.genSalt()
    const encryptedPin = await bcrypt.hash(pin, salt)
    const updatePin = await userModel.updateUser(initialResult[0].id, { pin: encryptedPin })
    if (updatePin.affectedRows > 0) {
      console.log(pin)
      sendEmail(email, pin, 'Sinyal App PIN Code')
      return response(res, 200, true, 'User Found successfully',
        {
          id: initialResult[0].id,
          firstName: initialResult[0].firstName,
          lastName: initialResult[0].lastName,
          picture: initialResult[0].picture,
          email: initialResult[0].email
        })
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
          token: token,
          id: initialResult[0].id,
          firstName: initialResult[0].firstName,
          lastName: initialResult[0].lastName,
          picture: initialResult[0].picture,
          email: initialResult[0].email
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
        if (fs.existsSync(initialResults[0].picture)) {
          fs.unlinkSync(`${initialResults[0].picture}`)
        }
        return response(res, 200, true, 'Picture hash been Updated', {
          id: initialResults[0].id,
          firstName: initialResults[0].firstName,
          lastName: initialResults[0].lastName,
          email: initialResults[0].email,
          picture
        })
      }
      return response(res, 400, false, 'Cant update image')
    }

    const finalResult = await userModel.updateUser(id, data)
    if (finalResult.affectedRows > 0) {
      return response(res, 200, true, 'Personal Information has been updated',
        {
          id: initialResults[0].id,
          firstName: initialResults[0].firstName,
          lastName: initialResults[0].lastName,
          picture: initialResults[0].picture,
          email: initialResults[0].email,
          ...data
        })
    }
    return response(res, 400, false, 'Cant Update personal Information')
  } catch (err) {
    console.log(err)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params

    const results = await userModel.getUsersByCondition({ id: id })

    if (results.length > 0) {
      return response(res, 200, true, 'User Found',
        {
          id: results[0].id,
          firstName: results[0].firstName,
          lastName: results[0].lastName,
          picture: results[0].picture,
          email: results[0].email
        })
    }
    return response(res, 404, false, 'User Not Found')
  } catch (err) {
    return response(res, 400, false, 'Bad Request')
  }
}
