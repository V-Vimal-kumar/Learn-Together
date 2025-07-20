// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
