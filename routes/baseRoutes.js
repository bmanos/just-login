const express = require('express')
const router = express.Router()
const {checkAuth, checkUser} = require('../middlewares/checkAuth')

router.get('*', checkUser)

// Define the home page route
router.get('/', (req, res) => { res.render('index') })

// Secret page
router.get('/secret', checkAuth, (req, res) => { res.render('secret') })

module.exports = router