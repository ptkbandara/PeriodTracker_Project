const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// Profile details update 
router.post('/updateProfile', async (req, res) => {
    const { userId, name, username, email, profilePic } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Details update 
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error while updating profile" });
    }
});

module.exports = router;