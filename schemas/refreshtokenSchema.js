const mongoose = require('mongoose');
const {Schema} = mongoose;

const refreshtokenSchema = new Schema({
    token: String
})

exports.refreshtokenSchema = refreshtokenSchema;