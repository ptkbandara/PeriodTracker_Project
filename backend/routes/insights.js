const express = require('express');
const router = express.Router();
const Cycle = require('../models/Cycle');

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cycles = await Cycle.find({ userId: userId }).sort({ startDate: 1 });

    if (!cycles || cycles.length === 0) {
      return res.status(404).json({ message: "No data found for this user." });
    }

    let totalCycleDays = 0;
    let totalPeriodDays = 0;
    let longestPeriod = 0;

    const cycleTrend = [];
    const cycleLabels = [];
    const periodDuration = [];
    const periodLabels = [];

    cycles.forEach((cycle) => {
      const periodLength = Math.ceil((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24));

      totalCycleDays += cycle.cycleLength;
      totalPeriodDays += periodLength;

      if (periodLength > longestPeriod) {
        longestPeriod = periodLength;
      }

      const month = new Date(cycle.startDate).toLocaleString('en-US', { month: 'short' });
      cycleLabels.push(month);
      cycleTrend.push(cycle.cycleLength);
      periodLabels.push(month);
      periodDuration.push(periodLength);
    });

    const avgCycle = Math.round(totalCycleDays / cycles.length);
    const avgPeriod = Math.round(totalPeriodDays / cycles.length);

    // Get last 6 months for charts
    const finalCycleLabels = cycleLabels.slice(-6);
    const finalCycleTrend = cycleTrend.slice(-6);
    const finalPeriodLabels = periodLabels.slice(-6);
    const finalPeriodDuration = periodDuration.slice(-6);

    // Dummy data for symptoms & moods (until separate models are created)
    const symptoms = [
      { name: 'Cramps', count: 16, max: 20 },
      { name: 'Fatigue', count: 6, max: 20 },
      { name: 'Bloating', count: 6, max: 20 },
      { name: 'Headache', count: 4, max: 20 },
      { name: 'Backache', count: 3, max: 20 },
    ];

    const moods = [
      { name: 'Normal', count: 5 },
      { name: 'Irritable', count: 4 },
      { name: 'Tired', count: 3 },
      { name: 'Happy', count: 3 },
    ];

    res.json({
      avgCycle,
      avgPeriod,
      totalCycles: cycles.length,
      longestPeriod,
      cycleTrend: finalCycleTrend,
      cycleLabels: finalCycleLabels,
      periodDuration: finalPeriodDuration,
      periodLabels: finalPeriodLabels,
      symptoms,
      moods
    });

  } catch (error) {
    console.error("Insights Error:", error);
    res.status(500).json({ error: "Server Error while fetching insights." });
  }
});

module.exports = router;