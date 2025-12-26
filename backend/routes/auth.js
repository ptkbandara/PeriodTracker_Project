const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  console.log("📥 Register Request Received:", req.body); // ✅ Frontend එකෙන් එන ඩේටා බලන්න

  const { name, email, password } = req.body;

  // 1. ඩේටා අඩුවෙන් එනවා නම්
  if (!name || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // 2. User කලින් ඉන්නවා නම්
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists. Try Login." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
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
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid password" });

  res.json({
    message: "Login successful",
    user: { id: user._id, email: user.email },
  });
});

module.exports = router;
