const Carrera = require('../models/carrera.model')

exports.load = async (req, res, next) => {
  const carrera = await Carrera
    .findOne({ alias: req.params.alias })
    .populate('materias')
  req.carrera = carrera
  return next()
}

exports.list = async (req, res) => {
  const listCarreras = await Carrera.find()
  res.render('carreras_list', { title: 'Carreras', listCarreras })
}

exports.get = async (req, res) => 
  res.render('carreras_details', {
    title: req.carrera.nombre,
    carrera: req.carrera
  })

exports.add = async (req, res) => 
  res.render('carreras_form', { title: 'Agregar carrera' })

exports.create = async (req, res) => {
  const carrera = await (new Carrera(req.body)).save()
  req.flash('success', 'Carrera agregada exitosamente.')
  res.redirect('/carreras')
}

exports.edit = async (req, res) => 
  res.render('carreras_form', {
    title: `Editar carrera: ${req.carrera.nombre}`,
    carrera: req.carrera
  })

exports.update = async (req, res) => {
  req.carrera.set(req.body)
  await req.carrera.save()
  req.flash('success', `Carrera "${req.carrera.nombre}" modificada exitosamente.`)
  res.redirect(`/carreras/editar/${req.carrera.alias}`)
}

exports.remove = async (req, res) => {
  await req.carrera.remove()
  req.flash('success', `Carrera "${req.carrera.nombre}" eliminada exitosamente.`)
  res.redirect('/carreras')
}