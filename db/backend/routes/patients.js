const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL PATIENTS (READ)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM patients ORDER BY patient_id");
    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// ADD PATIENT (CREATE)
router.post("/", async (req, res) => {
  try {
    const {
      cnic,
      name,
      dob,
      gender,
      city,
      province,
      phone,
      blood_group,
      family_history,
      smoking_history,
    } = req.body;

    await db.query(
      `INSERT INTO patients
            (cnic, name, dob, gender, city, province, phone, blood_group, family_history, smoking_history)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        cnic,
        name,
        dob,
        gender,
        city,
        province,
        phone,
        blood_group,
        family_history,
        smoking_history,
      ],
    );

    res.send("Patient added successfully");
  } catch (err) {
    res.send(err.message);
  }
});

// DELETE PATIENT
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM patients WHERE patient_id=$1", [req.params.id]);
    res.send("Patient deleted");
  } catch (err) {
    res.send(err.message);
  }
});

// UPDATE PATIENT (simple version)
router.put("/:id", async (req, res) => {
  try {
    const { name, city, phone } = req.body;

    await db.query(
      `UPDATE patients
            SET name=$1, city=$2, phone=$3
            WHERE patient_id=$4`,
      [name, city, phone, req.params.id],
    );

    res.send("Patient updated");
  } catch (err) {
    res.send(err.message);
  }
});
// SEARCH PATIENT

// SEARCH PATIENT BY CNIC OR NAME

// SEARCH PATIENT BY NAME STARTING WITH OR EXACT CNIC

router.get("/search/:value", async (req, res) => {
  try {
    const value = req.params.value;

    const result = await db.query(
      `
SELECT * FROM patients

WHERE split_part(name,' ',1) ILIKE $1

OR cnic = $2
`,

      [value, value],
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = router;
