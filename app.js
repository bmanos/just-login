// Declare packages
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = process.env.PORT ||  3000
const site_url = process.env.SITE_URL || 'localhost'
// Import routes
const baseRouter = require('./routes/baseRoutes')
const authRouter = require('./routes/authRoutes')

// Serving static files in Express
app.use(express.static('public'))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

// Using template engine with Express
app.set('view engine', 'ejs')

// Use Routes
app.use('/', baseRouter)
app.use('/auth/', authRouter)
// Catch all routes
app.get('*', (req, res) => { res.status(404).send('404') })

// Start app
app.listen(port, () => {
  console.log(`Example app listening at http://${site_url}:${port}`)
})
