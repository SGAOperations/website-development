const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pictureUrl: { type: String, required: true },
  position: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);