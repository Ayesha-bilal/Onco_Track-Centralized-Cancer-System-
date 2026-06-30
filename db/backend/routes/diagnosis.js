const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL DIAGNOSIS

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM diagnosis ORDER BY diagnosis_id",
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// ADD DIAGNOSIS

router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      hospital_id,
      cancer_type,
      cancer_stage,
      affected_organ,
      diagnosis_date,
      notes,
    } = req.body;

    await db.query(
      `

INSERT INTO diagnosis

(
patient_id,
doctor_id,
hospital_id,
cancer_type,
cancer_stage,
affected_organ,
diagnosis_date,
notes
)


VALUES

($1,$2,$3,$4,$5,$6,$7,$8)

`,

      [
        patient_id,
        doctor_id,
        hospital_id,
        cancer_type,
        cancer_stage,
        affected_organ,
        diagnosis_date,
        notes,
      ],
    );

    res.send("Diagnosis Added");
  } catch (err) {
    res.send(err.message);
  }
});

// UPDATE DIAGNOSIS

router.put("/:id", async (req, res) => {
  try {
    const { cancer_type, cancer_stage, affected_organ, notes } = req.body;

    await db.query(
      `

UPDATE diagnosis

SET

cancer_type=$1,
cancer_stage=$2,
affected_organ=$3,
notes=$4


WHERE diagnosis_id=$5

`,

      [cancer_type, cancer_stage, affected_organ, notes, req.params.id],
    );

    res.send("Diagnosis Updated");
  } catch (err) {
    res.send(err.message);
  }
});

// DELETE DIAGNOSIS

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM diagnosis WHERE diagnosis_id=$1",

      [req.params.id],
    );

    res.send("Diagnosis Deleted");
  } catch (err) {
    res.send(err.message);
  }
});

// SEARCH DIAGNOSIS

router.get("/search/:value", async (req, res) => {
  try {
    const value = req.params.value;

    const result = await db.query(
      `

SELECT *

FROM diagnosis


WHERE cancer_type ILIKE $1

OR affected_organ ILIKE $1

OR patient_id::text=$2

OR diagnosis_id::text=$2


`,

      [value + "%", value],
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
