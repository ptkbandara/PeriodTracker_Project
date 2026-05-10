const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");



const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const cycleRoutes = require("./routes/cycle");
const insightsRoutes = require("./routes/insights");
const trackRoutes = require("./routes/track");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cycles", cycleRoutes);
app.use("/api/insights", require("./routes/insights"));
app.use("/api/track", trackRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use('/api/chat', chatbotRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);