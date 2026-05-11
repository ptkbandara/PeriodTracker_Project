const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  flow: { 
    type: String,
    enum: ['Light', 'Medium', 'Heavy', null], 
    default: null 
  },
  symptoms: { 
    type: [String], 
    default: [] 
  },
  mood: { 
    type: String,
    enum: ['Happy', 'Normal', 'Sad', 'Anxious', 'Irritable', 'Tired', null], 
    default: null 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);