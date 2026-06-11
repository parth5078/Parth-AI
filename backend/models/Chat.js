const mongoose = require('mongoose');
const messageSchema = require('./Message').schema;

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema],
  model: {
    type: String,
    default: 'openai/gpt-oss-120b:free'
  },
  language: {
    type: String,
    enum: ['english', 'gujarati', 'hindi'],
    default: 'english'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
