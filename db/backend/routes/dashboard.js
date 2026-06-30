const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const patients = await db.query("SELECT COUNT(*) FROM patients");

    const doctors = await db.query("SELECT COUNT(*) FROM doctors");

    const hospitals = await db.query("SELECT COUNT(*) FROM hospitals");

    const diagnosis = await db.query("SELECT COUNT(*) FROM diagnosis");

    const treatments = await db.query("SELECT COUNT(*) FROM treatments");

    res.json({
      patients: Number(patients.rows[0].count),

      doctors: Number(doctors.rows[0].count),

      hospitals: Number(hospitals.rows[0].count),

      diagnosis: Number(diagnosis.rows[0].count),

      treatments: Number(treatments.rows[0].count),
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

module.exports = router;
