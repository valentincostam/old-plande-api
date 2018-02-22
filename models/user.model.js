const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  }
})

UserSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con ese email.' })
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

UserSchema.statics.registerAsync = function (data, password) {
  return new Promise((resolve, reject) => {
    this.register(data, password, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

module.exports = mongoose.model('User', UserSchema)