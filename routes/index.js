const express = require('express')
const carreraRoutes = require('./carrera.route')
const authRoutes = require('./auth.route')

const router = express.Router()

router.get('/', (req, res) => res.render('index', { title: 'Inicio' }))
router.use('/usuarios', authRoutes)
router.use('/carreras', carreraRoutes)

module.exports = router