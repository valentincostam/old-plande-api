const express = require('express')
const controller = require('../controllers/auth.controller')
const { asyncHandler } = require('../handlers/errorHandlers')

const router = express.Router()

router.get('/register', controller.registerForm)
router.post('/register',
  controller.validateRegister,
  controller.register,
  controller.login)
router.get('/login', controller.loginForm)
router.post('/login', controller.login)
router.get('/logout', controller.logout)

module.exports = router