const express = require('express')
const carreraRoutes = require('./carrera.route')
const authRoutes = require('./auth.route')

const router = express.Router()

router.use('/carreras', carreraRoutes)
router.use('/usuarios', authRoutes)

module.exports = router