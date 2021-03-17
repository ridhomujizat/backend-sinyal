const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const { APP_PORT } = process.env

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors('*'))

app.use('/upload', express.static('upload'))

// Put Routes in here
app.use('/user', require('./src/routes/user'))
app.use('/contact', require('./src/routes/contact'))
app.use('/chat', require('./src/routes/chat'))

// Test App
app.get('/', (req, res) => {
  const data = {
    success: true,
    message: 'Backend is running wel'
  }
  res.send(data)
})

// Not Found Api
app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found!'
  })
})

app.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`)
})
