const mailer = require('nodemailer')
const fs = require('fs')
const mustache = require('mustache')
const userModel = require('../models/user')
const path = require('path')
const { EMAIL_USER, EMAIL_PASS } = process.env

module.exports = async (email, pin, subject, message) => {
  const template = fs.readFileSync(path.resolve(__dirname, './template.html'), 'utf-8')

  const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  })

  const getUserEmail = await userModel.getUser(email)
  const results = {
    pin: pin
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: getUserEmail[0].email,
    subject: subject,
    html: mustache.render(template, { ...results })
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err
    console.log('Email sent: ' + info.response)
  })
}
