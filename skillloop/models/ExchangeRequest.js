// models/ExchangeRequest.js - Exchange request model
const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Associated skill ID is required']
  },
  skillTitle: {
    type: String,
    required: [true, 'Skill title is required']
  },
  requesterName: {
    type: String,
    required: [true, 'Requester name is required'],
    trim: true
  },
  ownerName: {
    type: String,
    required: [true, 'Skill owner name is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Exchange proposal message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
