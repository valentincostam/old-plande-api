const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const sassMiddleware = require('node-sass-middleware')
const mongoose = require('mongoose')
const routes = require('./routes')
const errorHandlers = require('./handlers/errorHandlers')
const passport = require('passport')
const User = require('./models/user.model')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/plan-de-estudios')
// mongoose.connect('mongodb://localhost:27017/plan-de-estudios', { autoIndex: false })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: 'vale',
  resave: false,
  saveUninitialized: false,
}))

// Configure passport middleware
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(flash())
app.use((req, res, next) => {
  res.locals.flashes = req.flash()
  next()
})

app.use('/', routes)

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
}

// production error handler
app.use(errorHandlers.productionErrors)

module.exports = app
