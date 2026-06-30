const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL DOCTORS

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM doctors ORDER BY doctor_id");

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// ADD DOCTOR

router.post("/", async (req, res) => {
  try {
    const { doctor_name, specialization, phone, email, hospital_id } = req.body;

    await db.query(
      `
INSERT INTO doctors
(doctor_name,specialization,phone,email,hospital_id)

VALUES

($1,$2,$3,$4,$5)

`,

      [doctor_name, specialization, phone, email, hospital_id],
    );

    res.send("Doctor added");
  } catch (err) {
    res.send(err.message);
  }
});

// UPDATE DOCTOR

router.put("/:id", async (req, res) => {
  try {
    const { doctor_name, specialization, phone, email } = req.body;

    await db.query(
      `

UPDATE doctors

SET doctor_name=$1,
specialization=$2,
phone=$3,
email=$4

WHERE doctor_id=$5

`,

      [doctor_name, specialization, phone, email, req.params.id],
    );

    res.send("Doctor updated");
  } catch (err) {
    res.send(err.message);
  }
});

// DELETE DOCTOR

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM doctors WHERE doctor_id=$1",

      [req.params.id],
    );

    res.send("Doctor deleted");
  } catch (err) {
    res.send(err.message);
  }
});

// SEARCH DOCTOR
// SEARCH DOCTOR

router.get("/search/:value", async (req, res) => {
  try {
    const value = req.params.value;

    const result = await db.query(
      `
SELECT *

FROM doctors

WHERE doctor_name ILIKE $1

OR doctor_name ILIKE $2

OR doctor_id::text = $3

`,

      [value + "%", "% " + value + "%", value],
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = router;
