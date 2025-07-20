const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  totalModules: Number,
  isPublic: { type: Boolean, default: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  activeLearners: { type: Number, default: 0 },
}, { timestamps: true });


module.exports = mongoose.model('Course', courseSchema);
