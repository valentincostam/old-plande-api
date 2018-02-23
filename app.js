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

require('dotenv').config()

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE)

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
  secret: process.env.SECRET,
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
  res.locals.user = req.user || null
  next()
})

app.use('/', routes)

app.use(errorHandlers.notFound)
app.use(errorHandlers.flashValidationErrors)

if (app.get('env') === 'development')
  app.use(errorHandlers.developmentErrors)
  
app.use(errorHandlers.productionErrors)

module.exports = app
