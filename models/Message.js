const { getDateStr } = require('../logic/helpers');

const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, maxlength: 100, required: true },
  content: { type: String, required: true },
});
MessageSchema.virtual('dateStr').get(function () {
  return getDateStr(this.date);
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
