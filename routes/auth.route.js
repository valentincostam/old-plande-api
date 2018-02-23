const express = require('express')
const controller = require('../controllers/auth.controller')
const { asyncHandler } = require('../handlers/errorHandlers')

const router = express.Router()

router.get('/registro', controller.registerForm)
router.post('/registro',
  controller.validateRegister,
  asyncHandler(controller.register),
  controller.login)
router.get('/ingresar', controller.loginForm)
router.post('/ingresar', controller.login)
router.get('/salir', controller.logout)
router.get('/cuenta', controller.isLoggedIn, controller.accountForm)
router.post('/cuenta', controller.updateAccount)
router.post('/cuenta/reestablecer', asyncHandler(controller.forgot));
router.get('/cuenta/reestablecer/:token',
  asyncHandler(controller.checkReset),
  controller.resetForm);
router.post('/cuenta/reestablecer/:token',
  controller.confirmedPasswords,
  asyncHandler(controller.checkReset),
  asyncHandler(controller.updatePassword)
);

module.exports = router