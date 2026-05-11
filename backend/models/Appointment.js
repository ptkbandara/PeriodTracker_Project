const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    }, // ඇප් එක පාවිච්චි කරන කෙනාගේ ID එක
    doctorId: { 
        type: String, 
        required: true 
    }, // Doctor ගේ ID එක
    doctorName: { 
        type: String, 
        required: true 
    },
    hospital: { 
        type: String, 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    }, // චැනල් කරන දවස
    time: { 
        type: String, 
        required: true 
    }, // වෙලාව
    status: { 
        type: String, 
        default: 'Confirmed' 
    } // Booking එකේ තත්ත්වය (Confirmed, Cancelled වගේ)
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);