const express = require('express')
const carreraRoutes = require('./carrera.route')

const router = express.Router()

router.use('/carreras', carreraRoutes)

module.exports = router