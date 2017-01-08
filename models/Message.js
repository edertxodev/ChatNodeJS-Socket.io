var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  userid: Number,
  msg: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);
