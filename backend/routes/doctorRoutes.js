const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// 1. ඔක්කොම Doctors ලගේ විස්තර ඇප් එකට යවන Route එක (GET /api/doctors)
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. Database එකට ලේසියෙන්ම ඩේටා ටික දාගන්න හදපු Seed Route එක (POST /api/doctors/seed)
router.post('/seed', async (req, res) => {
    const sampleDoctors = [
        { name: 'Dr. Hemantha Dodampahala', specialty: 'Gynecologist', rating: '4.9', experience: '25 Yrs', province: 'Western', district: 'Colombo', hospital: 'Nawaloka Hospital', image: '👨‍⚕️' },
        { name: 'Dr. Vijith Vidyabhushana', specialty: 'Gynecologist', rating: '4.8', experience: '20 Yrs', province: 'Western', district: 'Colombo', hospital: 'Lanka Hospitals', image: '👨‍⚕️' },
        { name: 'Dr. T. G. Amal Piyumantha', specialty: 'Women\'s Health', rating: '4.7', experience: '18 Yrs', province: 'Central', district: 'Kandy', hospital: 'Suwasevana Hospital', image: '👨‍⚕️' },
        { name: 'Dr. Chaminda Mathota', specialty: 'Gynecologist', rating: '4.9', experience: '15 Yrs', province: 'Western', district: 'Gampaha', hospital: 'Hemas Hospital', image: '👨‍⚕️' },
        { name: 'Dr. (Mrs) M.S. Silva', specialty: 'Fertility Expert', rating: '4.9', experience: '15 Yrs', province: 'Western', district: 'Colombo', hospital: 'Asiri Medical', image: '👩‍⚕️' },
        { name: 'Dr. Darshana De Silva', specialty: 'Obstetrician', rating: '4.8', experience: '20 Yrs', province: 'Southern', district: 'Galle', hospital: 'Ruhunu Hospital', image: '👨‍⚕️' },
        { name: 'Dr. Saman Kumara', specialty: 'Women\'s Health', rating: '4.5', experience: '10 Yrs', province: 'Uva', district: 'Badulla', hospital: 'Badulla General', image: '👨‍⚕️' },
        { name: 'Dr. R.M. Mudiyanse', specialty: 'Gynecologist', rating: '4.9', experience: '14 Yrs', province: 'North Western', district: 'Kurunegala', hospital: 'Co-operative Hospital', image: '👨‍⚕️' }
    ];

    try {
        // පරණ ඩේටා තියෙනවා නම් ඒව මකලා අලුතින් දානවා (කලවම් වෙන්නේ නැති වෙන්න)
        await Doctor.deleteMany({}); 
        await Doctor.insertMany(sampleDoctors);
        res.status(201).json({ message: "Doctors seeded successfully!" });
    } catch (error) {
        console.error("Error seeding doctors:", error);
        res.status(500).json({ message: "Error seeding data", error });
    }
});

module.exports = router;