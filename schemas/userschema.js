const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  email: String,
  password: String,
  comments: Array,
  // date: { type: Date, default: Date.now },
  uuid: String
});

exports.userSchema = userSchema;