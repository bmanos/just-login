const database = require('../database/database')

const checkExistingEmail = async () => {
  return new Promise((resolve, reject) => {
    database.appDatabase.all(
      'SELECT id, username, email FROM users',
      (error, rows) => {
        if (error) {
          reject(error)
          return
        }
        resolve(rows)
      }
    )
  })
}

const checkCredentials = async (email) => {
  return new Promise((resolve, reject) => {
    database.appDatabase.get(
      'SELECT id, username, email, password FROM users WHERE email = ?',
      [email],
      (error, row) => {
        if (error) {
          reject(error)
          return
        }
        resolve(row)
      }
    )
  })
}

const createUser = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    database.appDatabase.run('INSERT INTO users (username, email,  password) VALUES (?, ?, ?)', [username, email,  password], function(err) {
      if (err) {
        reject(err)
        return
      }
      // Get the last inserted row ID
      resolve(this.lastID)
    })
  })
}

module.exports = {
  checkExistingEmail,
  checkCredentials,
  createUser,
}