const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/policies — Create a new policy
router.post("/", async (req, res) => {
  const {
    customerName,
    dob,
    gender,
    mobile,
    email,
    address,
    planType,
    panNumber,
    membersCount,
    medicalConditions,
    nomineeName,
    premium,
    policyStartDate,
  } = req.body;

  // Basic validation
  if (
    !customerName ||
    !dob ||
    !gender ||
    !mobile ||
    !email ||
    !address ||
    !planType ||
    !panNumber ||
    !membersCount ||
    medicalConditions === undefined ||
    !nomineeName ||
    !premium ||
    !policyStartDate
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Agent ID should come from auth middleware
    // Example: req.user.id
    const agentId = req.user?.id || "AGENT_001"; // Replace with real auth logic

    const result = await pool.query(
      `INSERT INTO policies (
        customer_name,
        dob,
        gender,
        mobile,
        email,
        address,
        plan_type,
        pan_number,
        members_count,
        medical_conditions,
        nominee_name,
        premium,
        policy_start_date,
        agent_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *`,
      [
        customerName,
        dob,
        gender,
        mobile,
        email,
        address,
        planType,
        panNumber,
        membersCount,
        medicalConditions === "Yes", // convert to boolean
        nomineeName,
        premium,
        policyStartDate,
        agentId,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating policy:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/policies — Get all policies
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM policies ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching policies:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// // GET /api/policies/:id — Get single policy
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query("SELECT * FROM policies WHERE id = $1", [
//       id,
//     ]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Policy not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error fetching policy:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
