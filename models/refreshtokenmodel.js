const mongoose = require("mongoose");
const { refreshtokenSchema } = require('../schemas/refreshtokenSchema');

const schema = mongoose.Schema(refreshtokenSchema);
const RefreshToken = mongoose.model('RefreshToken', schema);

exports.RefreshToken = RefreshToken;