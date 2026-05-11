const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  cycleLength: { 
    type: Number, 
    default: 28
  }
}, { timestamps: true });

module.exports = mongoose.model('Cycle', cycleSchema);