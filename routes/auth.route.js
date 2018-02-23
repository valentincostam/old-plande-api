const express = require('express')
const controller = require('../controllers/auth.controller')
const { asyncHandler } = require('../handlers/errorHandlers')

const router = express.Router()

router.get('/registro', controller.registerForm)
router.post('/registro',
  controller.validateRegister,
  asyncHandler(controller.register),
  controller.login)
router.get('/cuenta', controller.isLoggedIn, controller.accountForm)
router.post('/cuenta', controller.updateAccount)
router.get('/ingresar', controller.loginForm)
router.post('/ingresar', controller.login)
router.get('/salir', controller.logout)

module.exports = router