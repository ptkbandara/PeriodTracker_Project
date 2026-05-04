const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');

router.post('/daily', async (req, res) => {
  try {
    const { userId, date, flow, symptoms, mood } = req.body;

    const log = await DailyLog.findOneAndUpdate(
      { userId, date },
      { flow, symptoms, mood },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );

    res.status(200).json({ message: "Daily log saved successfully!", log });
  } catch (error) {
    console.error("Daily Log Save Error:", error);
    res.status(500).json({ error: "Server Error while saving daily log." });
  }
});

module.exports = router;