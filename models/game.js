const mongoose = require('mongoose');
module.exports = mongoose.model('Game', new mongoose.Schema({
  name: String,
  img: String,
  download: String
}));