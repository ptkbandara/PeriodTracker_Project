const express = require('express');
const router = express.Router();
const Cycle = require('../models/Cycle');


router.post('/add', async (req, res) => {
  try {
    const { userId, startDate, endDate, cycleLength } = req.body;
    
    const newCycle = new Cycle({
      userId,
      startDate,
      endDate,
      cycleLength
    });

    await newCycle.save();
    res.status(201).json({ message: "Cycle saved successfully!", cycle: newCycle });
  } catch (error) {
    res.status(500).json({ error: "Failed to save cycle data." });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    
    const cycles = await Cycle.find({ userId: req.params.userId }).sort({ startDate: -1 });
    
    
    const pastCyclesArray = cycles.map(cycle => cycle.cycleLength);

    res.status(200).json({ 
      fullHistory: cycles, 
      pastCycleLengths: pastCyclesArray.reverse()
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cycles." });
  }
});

module.exports = router;