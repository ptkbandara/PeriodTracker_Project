const mongoose = require("mongoose");

const PeriodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  type: {
    type: String,
    default: "period_start",
  },
  symptoms: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Period", PeriodSchema);