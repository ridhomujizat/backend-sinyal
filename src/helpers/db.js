const mysql = require('mysql')

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env

const conn = mysql.createConnection({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
})

conn.connect()

module.exports = conn
