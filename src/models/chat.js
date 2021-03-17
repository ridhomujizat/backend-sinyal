const db = require('../helpers/db')

exports.getChatHistory = (id, cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT m.*, u.id as idUser, picture, firstName, lastName, email
    FROM message m
    INNER JOIN users u ON u.id=m.idSender OR u.id = m.idReceiver
    WHERE (m.idSender=${id} OR m.idReceiver=${id}) AND m.isLast = 1
    AND CONCAT(u.firstName, ' ', u.lastName) LIKE "%${cond.search}%"
    AND u.id NOT IN (${id})
    ORDER BY ${cond.sort} ${cond.order}
    LIMIT ${cond.limit} OFFSET ${cond.offset}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}
exports.getCountChatHistory = (id, cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT COUNT(m.id) as totalData
    FROM message m
    INNER JOIN users s ON s.id = m.idSender
    INNER JOIN users r ON r.id = m.idReceiver
    WHERE (m.idSender=${id} OR m.idReceiver=${id}) AND m.isLast = '1'
    ORDER BY m.${cond.sort} ${cond.order}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.getChatList = (id, idSelf, cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
      SELECT * FROM message 
      WHERE ((idSender=${id} AND idReceiver=${idSelf}) OR (idSender=${idSelf} AND idReceiver=${id})) 
      ORDER BY ${cond.sort} ${cond.order}
      LIMIT ${cond.limit} OFFSET ${cond.offset} 
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.getCountChatList = (id, idSelf, cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT COUNT(id) as totalData FROM message
    WHERE ((idSender=${id} AND idReceiver=${idSelf}) OR (idSender=${idSelf} AND idReceiver=${id})) 
    ORDER BY ${cond.sort} ${cond.order}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.sendChat = (data) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    INSERT INTO message
    (${Object.keys(data).join()})
    VALUES
    (${Object.values(data).map(item => `"${item}"`).join(',')})
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.changeLastChat = (id, idSelf) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
      UPDATE message
      SET isLast = '0'
      WHERE ((idSender=${id} AND idReceiver=${idSelf}) OR (idSender=${idSelf} AND idReceiver=${id})) 
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}
