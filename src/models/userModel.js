const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: [true, 'Username already exists']
  },
  email: {
    type: String,
    required: [true, 'Please provide email address'],
    unique: [true, 'Email address already exists']
  },
  password: {
    type: String,
    required: [true, 'Please provide password']
  }
})

module.exports = mongoose.model('user', userSchema);