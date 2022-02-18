const { getDateStr } = require('../logic/helpers');

const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, maxlength: 100, required: true },
  content: { type: String, required: true },
});
const Message = mongoose.model('Message', MessageSchema);

MessageSchema.virtual('dateStr').get(function () {
  console.log(getDateStr(this.date));
  return getDateStr(this.date);
});

module.exports = Message;
