const User = require('../models/user.model')
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

exports.registerForm = (req, res) => 
  res.render('register_form', { title: 'Registro' })

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
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(err => err.msg));
      return res.redirect('back')
      
      // return res.status(422).json({ errors: errors.mapped() });
    }
  
    // matchedData returns only the subset of data validated by the middleware
    const user = matchedData(req);
    // createUser(user).then(user => res.json(user));
    console.log('> Salió todo bien:', user)
    next()
  }
]

exports.register = async (req, res, next) => {
  const user = await (new User(req.body)).save()
  next()
}
exports.login = (req, res) => res.send('OK')
exports.loginForm = (req, res) => res.send('OK')
exports.login = (req, res) => res.send('OK')
exports.logout = (req, res) => res.send('OK')