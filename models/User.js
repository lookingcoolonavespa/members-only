const mongoose = require('mongoose');
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: { type: String, maxlength: 100, required: true },
    password: { type: String, required: true },
  })
);

module.exports = User;
