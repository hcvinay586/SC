const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin', 'manager'], default: 'user' },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
