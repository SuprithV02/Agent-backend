const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const policiesRouter = require("./routes/Policies");

const app = express();
const PORT = process.env.PORT || 3001;

//  Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // your React app's URL
  }),
);
app.use(express.json());

//Create table on startup
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id SERIAL PRIMARY KEY,

        customer_name TEXT NOT NULL,
        dob DATE NOT NULL,
        gender VARCHAR(20) NOT NULL,

        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,

        plan_type VARCHAR(100) NOT NULL,
        pan_number VARCHAR(12) NOT NULL,
        members_count INTEGER NOT NULL,

        medical_conditions BOOLEAN NOT NULL,
        nominee_name TEXT NOT NULL,

        premium NUMERIC(10,2) NOT NULL,
        policy_start_date DATE NOT NULL,

        agent_id VARCHAR(100) NOT NULL
      );
    `);

    console.log("✅ policies table ready");
  } catch (err) {
    console.error("❌ Failed to create table:", err.message);
    process.exit(1);
  }
};

// Routes
app.use("/api/policies", policiesRouter);

// Health check — useful for Docker
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//  Start
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
