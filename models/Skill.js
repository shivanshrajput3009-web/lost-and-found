// models/Skill.js - Skill model representing skills offered by students
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Skill description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Programming',
      'Design',
      'Music',
      'Languages',
      'Academics',
      'Fitness',
      'Photography',
      'Writing',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Skill level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  ownerName: {
    type: String,
    required: [true, 'Skill owner name is required'],
    trim: true
  },
  availability: {
    type: String,
    required: [true, 'Availability days/time are required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Time duration is required (e.g., 1 hour per session)'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Credit value is required'],
    min: [1, 'Credit value must be at least 1'],
    max: [100, 'Credit value cannot exceed 100']
  },
  status: {
    type: String,
    enum: ['Available', 'Taken'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', skillSchema);
