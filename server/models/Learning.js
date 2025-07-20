// models/Learning.js
const mongoose = require('mongoose');

const learningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  buddy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isComplete: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('Learning', learningSchema);
