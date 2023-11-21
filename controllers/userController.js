require('dotenv').config()
const userModel = require('../models/userModel')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register
const register = async (req, res) => {
  // Get request body values from the request object
  const { username, email, password } = req.body
  const errors = validationResult(req)

  // Validate request body
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  try {
    // Check if user already exists
    const existingUsers = await userModel.checkExistingEmail()
    const userExists = existingUsers.some((user) => user.email === email)

    // If user already exists, return error
    if (userExists) {
      return res.status(422).json({ errors: [{ msg: 'User already exists' }] })
    }

    // Proceed with user registration
    // Hash the password and save user to the database
    const hashedPassword = await bcrypt.hash(password, 15)
    const userId = await userModel.createUser(username, email, hashedPassword) // Get the ID

    // Create JWT token and send cookie to browser
    const token = jwt.sign({ userId, username }, process.env.JWT_TOKEN, { expiresIn: '1h' })
    res.cookie('jwt', token, { httpOnly: true, expiresIn: '1h' })

    res.status(201).json({ user: userId }) // Send back the userId

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  // Validate request body
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // Check if user exists in the database and password compare
  try {
    const dataFromDB = await userModel.checkCredentials(email)

    // If user not found, return error
    if (!dataFromDB) {
      return res.status(404).json({ errors: [{ msg: 'Invalid credentials' }] })
    }

    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcrypt.compare(password, dataFromDB.password)

    // If password is invalid, return error
    if (!isPasswordValid) {
      return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] })
    }

    // Create JWT token with user information and send cookie to browser
    const token = jwt.sign({ userId: dataFromDB.id, username: dataFromDB.username }, process.env.JWT_TOKEN, { expiresIn: '1h' })
    res.cookie('jwt', token, { httpOnly: true, expiresIn: '1h' })
    // You can add more data to the token payload if needed
    // ex: userId: dataFromDB.userId     

    // Return the token as a response
    // res.status(201).json({ token })
    res.status(201).json({ user: dataFromDB.id }) // Send back the userId

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

const logout = async (req, res) => {
  try {
    // Clear the JWT cookie by setting it to an empty value and expiring it immediately
    res.clearCookie('jwt')
    
    // res.status(200).json({ message: 'Logout successful' })
    res.redirect('/')
  } catch (error) {
    console.error('Error:', error)
    // res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
}

// Export controllers
module.exports = {
  register,
  login,
  logout
}
