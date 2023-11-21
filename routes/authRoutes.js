const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const {register, login, logout } = require('../controllers/userController')

// Define the register page route
// Get page
router.get('/register', (req, res) => { res.render('auth/register') })
// Post page
router.post('/register', [
  check('username', 'Please enter a username').notEmpty(),
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'Password length must be at least 8 characters long').isLength({ min: 8 })
], register)

// Define the login page route
// Get page
router.get('/login', (req, res) => {
  res.render('auth/login')
})
// Post page
router.post('/login', [
  check('email', 'Please provide a valid email').isEmail(),
  check('password', 'You must type a passwors').notEmpty()
], login)

// Define the logout page route
// Get page
router.get('/logout', logout)

// Catch all routes
router.get('*', (req, res) => { res.status(404).send('404') })

module.exports = router