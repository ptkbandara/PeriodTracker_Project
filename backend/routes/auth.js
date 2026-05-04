const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  console.log("📥 Register Request Received:", req.body); 

  
  const { name, username, password } = req.body;

  
  if (!name || !username || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("❌ User already exists:", username);
      return res.status(400).json({ message: "User already exists. Try Login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username, 
      password: hashedPassword,
    });

    await user.save();
    console.log("✅ User Created Successfully!");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* LOGIN */
router.post("/login", async (req, res) => {
  console.log("📥 Login Request Received:", req.body); 

 
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("❌ Missing fields in login");
    return res.status(400).json({ message: "Please enter username and password" });
  }

  try {
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", username);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("✅ Login Successful for:", username);
    res.json({
      message: "Login successful",
      user: { 
          id: user._id, 
          username: user.username,
          name: user.name 
      },
    });
  } catch (err) {
    console.error("❌ Login Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/updateProfile", async (req, res) => {
  const { userId, name, profilePic } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profilePic },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
