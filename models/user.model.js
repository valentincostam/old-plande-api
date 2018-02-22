const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  }
})

// Para validar la unicidad del campo 'nombre' y mostrar un mensaje de error.
UserSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con ese email.' })

UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 9);
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('User', UserSchema)