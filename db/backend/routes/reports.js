const express = require("express");
const router = express.Router();
const db = require("../db");

// TOTAL PATIENTS

router.get("/patients", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM patients");

    res.json(result.rows[0]);
  } catch (err) {
    res.send(err.message);
  }
});

// PATIENTS BY CITY

router.get("/city", async (req, res) => {
  try {
    const result = await db.query(
      `
SELECT city, COUNT(*) AS total

FROM patients

GROUP BY city

`,
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// CANCER TYPES

router.get("/cancer", async (req, res) => {
  try {
    const result = await db.query(
      `

SELECT cancer_type, COUNT(*) AS total

FROM diagnosis

GROUP BY cancer_type

`,
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// TREATMENT STATUS

router.get("/treatment", async (req, res) => {
  try {
    const result = await db.query(
      `

SELECT status, COUNT(*) AS total

FROM treatments

GROUP BY status

`,
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// HOSPITAL REPORT

router.get("/hospital", async (req, res) => {
  try {
    const result = await db.query(
      `

SELECT h.hospital_name,
COUNT(d.diagnosis_id) AS total


FROM hospitals h


LEFT JOIN diagnosis d

ON h.hospital_id=d.hospital_id


GROUP BY h.hospital_name


`,
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// INDIVIDUAL PATIENT REPORT

router.get("/patient/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const patient = await db.query(
      `
SELECT *
FROM patients
WHERE patient_id=$1

`,
      [id],
    );

    const diagnosis = await db.query(
      `

SELECT *

FROM diagnosis

WHERE patient_id=$1

`,

      [id],
    );

    const treatment = await db.query(
      `

SELECT *

FROM treatments

WHERE diagnosis_id IN

(
SELECT diagnosis_id
FROM diagnosis
WHERE patient_id=$1
)

`,

      [id],
    );

    res.json({
      patient: patient.rows[0],

      diagnosis: diagnosis.rows,

      treatment: treatment.rows,
    });
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
