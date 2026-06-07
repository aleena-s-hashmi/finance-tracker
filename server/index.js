const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});