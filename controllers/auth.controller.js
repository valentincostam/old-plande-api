const User = require('../models/user.model')
const passport = require('passport')
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

exports.registerForm = (req, res) => 
  res.render('register_form', { title: 'Registro' })

exports.loginForm = (req, res) =>
  res.render('login_form', { title: 'Ingresar' })

exports.validateRegister = [
  check('name', 'Ingresa un nombre de usuario.')
    .isLength({ min: 1 })
    .trim(),

  check('email')
    .isEmail().withMessage('Ingresa un email válido.')
    .trim()
    .normalizeEmail(),

  check('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres de largo.')
    .matches(/\d/).withMessage('La contraseña debe tener al menos un número.'),
  
  check('password-confirm', 'La contraseña y su confirmación deben coincidir.')
    .exists()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(err => err.msg))
      return res.redirect('back')      
    }
    
    next()
  }
]

exports.register = async (req, res, next) => {
  const newUser = new User({ email: req.body.email, name: req.body.name })
  await User.registerAsync(newUser, req.body.password)
  next()
}

exports.login = passport.authenticate('local', {
  failureRedirect: '/usuarios/ingresar',
  failureFlash: 'Email y/o contraseña incorrectos.',
  successRedirect: '/carreras',
  successFlash: '¡Bienvenido!'
});

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'Has salido.')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Debe haber ingresado para poder acceder aquí.');
  res.redirect('/usuarios/ingresar');
};