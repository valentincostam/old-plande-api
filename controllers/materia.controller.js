const Materia = require('../models/materia.model')
const Carrera = require('../models/carrera.model')

exports.load = async (req, res, next) => {
  const materia = await Materia
    .findById(req.params.id)
    .populate('necesitaAprobada', 'nombre')
    .populate('necesitaRegular', 'nombre')
    .populate('carrera', 'nombre')
  req.materia = materia
  return next()
}

exports.list = async (req, res) => 
  res.render('carreras_details', { title: req.carrera.nombre, carrera: req.carrera })

exports.get = async (req, res) => 
  res.render('materias_details', {
    title: req.materia.nombre,
    materia: req.materia,
    carrera: req.carrera
  })

exports.add = async (req, res) =>
  res.render('materias_form', {
    title: 'Agregar materia',
    carrera: req.carrera,
    listMaterias: req.carrera.materias,
    listEtiquetas: Materia.schema.path('etiqueta').enumValues
  })

exports.create = async (req, res) => {
  const materia = await (new Materia(req.body)).save()
  req.flash('success', 'Materia agregada exitosamente.')
  res.redirect(`/carreras/${req.carrera.alias}`)
}

exports.edit = async (req, res) =>
  res.render('materias_form', {
    title: `Editar materia: ${req.materia.nombre}`,
    materia: req.materia,
    carrera: req.carrera,
    listMaterias: req.carrera.materias,
    listEtiquetas: Materia.schema.path('etiqueta').enumValues
  })

exports.update = async (req, res) => {
  req.materia.set(req.body)
  await req.materia.save()
  req.flash('success', `Materia "${req.materia.nombre}" modificada exitosamente.`)
  res.redirect(`/carreras/${req.carrera.alias}/materias/${req.materia.id}/editar`)
}

exports.remove = async (req, res) => {
  await req.materia.remove()
  req.flash('success', `Materia "${req.materia.nombre}" eliminada exitosamente.`)
  res.redirect(`/carreras/${req.carrera.alias}/materias/`)
}