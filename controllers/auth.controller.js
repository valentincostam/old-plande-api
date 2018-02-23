const User = require('../models/user.model')
const passport = require('passport')
const crypto = require('crypto')
const mail = require('../handlers/mail')
const { check, validationResult } = require('express-validator/check')
const { promisify } = require('util')

exports.registerForm = (req, res) => 
  res.render('register_form', { title: 'Registro' })

exports.loginForm = (req, res) =>
  res.render('login_form', { title: 'Ingresar' })

exports.accountForm = (req, res) =>
  res.render('account_form', { title: 'Ingresar' })

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
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'Has salido.')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.flash('error', 'Debe haber ingresado para poder acceder aquí.')
  res.redirect('/usuarios/ingresar')
}

exports.updateAccount = async (req, res) => {
  const user = await User.findById(req.user._id)
  user.set(req.body)
  await user.save()
  req.flash('success', 'Cuenta modificada exitosamente.')
  res.redirect('back')
}

exports.forgot = async (req, res) => {
  // 1. Se fija si existe un usuario con esa cuenta.
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    req.flash('error', 'No existe cuenta con ese email.')
    return res.redirect('/usuarios/ingresar')
  }
  // 2. Establece el token y la expiración del reset.
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hora a partir de ahora
  await user.save()
  
  // 3. Envía un email con el token.
  const resetURL = `http://${req.headers.host}/cuenta/reestablecer/${user.resetPasswordToken}`
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Reestablecer contraseña',
    resetURL
  })
  req.flash('success', `Se te ha enviado un email con un link para reestablecer la contraseña.`)

  // 4. Redirecciona a la página de login.
  res.redirect('/usuarios/ingresar')
}

exports.checkReset = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    req.flash('error', 'No has solicitado reestablecer tu contraseña o el tiempo para hacerlo expiró.')
    return res.redirect('/usuarios/ingresar')
  }

  next()
}

exports.resetForm = (req, res) => 
  res.render('reset_form', { title: 'Reestablece tu contraseña' })


exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) return next()
  req.flash('error', 'Las contraseñas no coinciden.')
  res.redirect('back')
}

exports.updatePassword = async (req, res) => {
  const setPassword = promisify(user.setPassword)
  await setPassword(req.body.password)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  const updatedUser = await user.save()
  await req.login(updatedUser)
  req.flash('success', '¡Listo! Tu contraseña ha sido reestablecida. Ahora ingresaste.')
  res.redirect('/')
}