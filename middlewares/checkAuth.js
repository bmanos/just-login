require('dotenv').config()
const jwt = require('jsonwebtoken')

// Check authentication
const checkAuth = async (req, res, next) => {
  const token = req.cookies.jwt
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
    req.user = decodedToken.username // Assuming 'username' is in the token payload
    next()
  } catch (error) {
    // return res.status(400).json({ errors: [{ msg: 'Invalid token' }] })
    // console.log(error.message)
    res.redirect('/auth/login')
  }
}

// Check current user
// Middleware to decode JWT token and set username in response locals
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt // Assuming the token is stored in a cookie
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        res.locals.username = null
      } else {
        res.locals.username = decodedToken.username
      }
      next()
    })
  } else {
    res.locals.username = null
    next()
  }
}

module.exports = {
  checkAuth,
  checkUser
}
