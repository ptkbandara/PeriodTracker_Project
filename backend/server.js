const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const periodRoutes = require("./routes/periodRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/periods", periodRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);