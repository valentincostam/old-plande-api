const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const CarreraSchema = mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
    required: 'Ingrese el nombre de la carrera.',
    trim: true
  },
  anos: {
    type: Number,
    min: 1,
    max: 6,
    required: 'Ingrese la cantidad de años que tiene el plan de estudios de la carrera.'
  },
  alias: {
    type: String,
    unique: true,
    required: 'Ingrese el alias de la carrera (ej. sistemas, electro, loi, civil).',
    trim: true
  },
  materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }]
})

// Para validar la unicidad del campo 'nombre' y mostrar un mensaje de error.
CarreraSchema.plugin(uniqueValidator, { message: 'Ya existe una carrera con ese nombre o alias.' })

// Antes de eliminar una carrera, elimina sus referencias.
CarreraSchema.pre('remove', function (next) {
  const carreraId = mongoose.Types.ObjectId(this._id)
  this.model('Materia').deleteMany({ carrera: { $eq: carreraId } }, next)
})

module.exports = mongoose.model('Carrera', CarreraSchema)