const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// 1. අලුත් Booking එකක් සේව් කරන Route එක (POST /api/appointments/book)
router.post('/book', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const savedAppointment = await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully!", appointment: savedAppointment });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Failed to book appointment", error });
    }
});

// 2. User කෙනෙක්ගේ ඔක්කොම Bookings ටික බලාගන්න Route එක (GET /api/appointments/:userId)
router.get('/:userId', async (req, res) => {
    try {
        // අලුත්ම Bookings උඩින් එන්න sort කරලා තියෙන්නේ
        const appointments = await Appointment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

module.exports = router;