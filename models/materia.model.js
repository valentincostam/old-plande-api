const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const MateriaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: 'Ingrese el nombre de la materia.',
    trim: true
  },
  horas: {
    type: Number,
    min: 1,
    required: 'Ingrese la cantida de horas semanales de la materia.'
  },
  esAnual: {
    type: Boolean,
    default: false
  },
  ano: {
    type: Number,
    min: 1,
    max: 6,
    required: 'Ingrese el año al que pertenece la materia.'
  },
  cuatrimestre: {
    type: Number,
    min: 1,
    max: 2
  },
  estado: {
    type: String,
    enum: ['desaprobada', 'aprobada', 'regular', 'cursando'],
    default: 'desaprobada',
    lowercase: true
  },
  etiqueta: {
    type: String,
    enum: ['ninguna', 'básica', 'electiva', 'integradora'],
    default: 'ninguna',
    lowercase: true
  },
  carrera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrera',
    required: 'La materia debe pertenecer a una carrera.'
    // set: value => value === '' ? undefined : value 
  },
  necesitaAprobada: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }],
  necesitaRegular:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }]
})

// En una carrera no pueden haber dos materias con el mismo nombre.
// MateriaSchema.index({ nombre: 1, carrera: 1 }, { unique : true })

// Para validar la unicidad del campo 'nombre' y mostrar un mensaje de error.
MateriaSchema.plugin(uniqueValidator, { message: 'Ya existe una materia con ese nombre en ese cuatrimestre.' })

// Antes de eliminar una materia, elimina sus referencias.
MateriaSchema.pre('remove', function (next) {
  const materiaId = mongoose.Types.ObjectId(this._id)

  // Quita la materia como correlativa de otras materias.
  this.model('Materia').update(
    { $or: [
      { necesitaAprobada: { $elemMatch: { $eq: materiaId } } },
      { necesitaRegular: { $elemMatch: { $eq: materiaId } } }
    ]},
    { $pull: { necesitaAprobada: materiaId, necesitaRegular: materiaId } },
    { multi: true }
    // (err, raw) => {
    //   console.log('(!) Materia.update() se ejecuta y el raw es:', raw)
    // }
  ).exec()

  // Quita la materia de la carrera.
  this.model('Carrera').update(
    { _id: this.carrera },
    { $pull: { materias: materiaId } }
    // (err, raw) => {
    //   console.log('(!) Carrera.update() se ejecuta y el raw es:', raw)
    // }
  ).exec()
  
  next()
})

// Después de guardar una materia, la agrega a la carrera correspondiente.
MateriaSchema.post('save', function (materia, next) {
  if (!materia.carrera) return next()

  const materiaId = mongoose.Types.ObjectId(materia._id)

  this.model('Carrera').update(
    { _id: materia.carrera,
      materias: { $not: { $elemMatch: { $eq: materiaId } } }
    },
    { $push: { materias: materiaId } },
    next
  )
})

module.exports = mongoose.model('Materia', MateriaSchema)