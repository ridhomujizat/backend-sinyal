const mailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const fs = require('fs')
const mustache = require('mustache')
const userModel = require('../models/user')
const path = require('path')

const {
  EMAIL_SERVICE,
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_PASS
} = process.env

module.exports = async (email, pin, subject, message) => {
  const template = fs.readFileSync(path.resolve(__dirname, './template.html'), 'utf-8')

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: EMAIL_SERVICE,
      host: EMAIL_HOST,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
  )

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
