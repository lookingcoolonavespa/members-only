const mongoose = require('mongoose');
const Message = mongoose.model(
  'Message',
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    title: { type: String, maxlength: 100, required: true },
    content: { type: String, required: true },
  })
);

module.exports = Message;
