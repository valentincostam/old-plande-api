const express = require('express')
const controller = require('../controllers/materia.controller')
const { asyncHandler } = require('../handlers/errorHandlers')

const router = express.Router()

router.param('id', asyncHandler(controller.load))

router.get('/', asyncHandler(controller.list))
router.get('/agregar', asyncHandler(controller.add))
router.post('/agregar',asyncHandler(controller.create))
router.get('/:id', asyncHandler(controller.get))
router.get('/:id/editar', asyncHandler(controller.edit))
router.post('/:id/editar', asyncHandler(controller.update))
router.get('/:id/eliminar', asyncHandler(controller.remove))

module.exports = router