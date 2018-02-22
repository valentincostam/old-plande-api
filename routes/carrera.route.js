const express = require('express')
const controller = require('../controllers/carrera.controller')
const auth = require('../controllers/auth.controller')
const materiaRoutes = require('./materia.route')
const { asyncHandler } = require('../handlers/errorHandlers')

const router = express.Router()

router.use(auth.isLoggedIn)

router.param('alias', asyncHandler(controller.load))

router.get('/', asyncHandler(controller.list))
router.get('/agregar', asyncHandler(controller.add))
router.post('/agregar', asyncHandler(controller.create))
router.get('/:alias', asyncHandler(controller.get))
router.get('/:alias/editar', asyncHandler(controller.edit))
router.post('/:alias/editar', asyncHandler(controller.update))
router.get('/:alias/eliminar', asyncHandler(controller.remove))
router.use('/:alias/materias', materiaRoutes)

module.exports = router