const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL TREATMENTS

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM treatments ORDER BY treatment_id",
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// ADD TREATMENT

router.post("/", async (req, res) => {
  try {
    const {
      diagnosis_id,
      doctor_id,
      treatment_type,
      start_date,
      end_date,
      status,
    } = req.body;

    await db.query(
      `

INSERT INTO treatments

(
diagnosis_id,
doctor_id,
treatment_type,
start_date,
end_date,
status
)


VALUES

($1,$2,$3,$4,$5,$6)

`,

      [diagnosis_id, doctor_id, treatment_type, start_date, end_date, status],
    );

    res.send("Treatment Added");
  } catch (err) {
    res.send(err.message);
  }
});

// UPDATE TREATMENT

router.put("/:id", async (req, res) => {
  try {
    const { treatment_type, start_date, end_date, status } = req.body;

    await db.query(
      `

UPDATE treatments

SET

treatment_type=$1,

start_date=$2,

end_date=$3,

status=$4


WHERE treatment_id=$5

`,

      [treatment_type, start_date, end_date, status, req.params.id],
    );

    res.send("Treatment Updated");
  } catch (err) {
    res.send(err.message);
  }
});

// DELETE TREATMENT

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM treatments WHERE treatment_id=$1",

      [req.params.id],
    );

    res.send("Treatment Deleted");
  } catch (err) {
    res.send(err.message);
  }
});

// SEARCH TREATMENT

router.get("/search/:value", async (req, res) => {
  try {
    const value = req.params.value;

    const result = await db.query(
      `

SELECT *

FROM treatments


WHERE treatment_type ILIKE $1

OR status ILIKE $1

OR diagnosis_id::text=$2

OR treatment_id::text=$2


`,

      [value + "%", value],
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
