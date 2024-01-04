const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  uuid: String, // String is shorthand for {type: String}
  sender: String,
  reciever: String,
  content: Array,
  // date: { type: Date, default: Date.now },
  sent_at: {type: Date, default: Date.now}
});

exports.messageSchema = messageSchema;