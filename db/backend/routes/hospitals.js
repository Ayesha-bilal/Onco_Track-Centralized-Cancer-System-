const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL HOSPITALS

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM hospitals ORDER BY hospital_id",
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

// ADD HOSPITAL

router.post("/", async (req, res) => {
  try {
    const { hospital_name, city, province, contact, email, license_number } =
      req.body;

    await db.query(
      `

INSERT INTO hospitals

(hospital_name,city,province,contact,email,license_number)

VALUES

($1,$2,$3,$4,$5,$6)

`,

      [hospital_name, city, province, contact, email, license_number],
    );

    res.send("Hospital added");
  } catch (err) {
    res.send(err.message);
  }
});

// UPDATE HOSPITAL

router.put("/:id", async (req, res) => {
  try {
    const { hospital_name, city, province, contact, email } = req.body;

    await db.query(
      `

UPDATE hospitals

SET hospital_name=$1,
city=$2,
province=$3,
contact=$4,
email=$5

WHERE hospital_id=$6

`,

      [hospital_name, city, province, contact, email, req.params.id],
    );

    res.send("Hospital updated");
  } catch (err) {
    res.send(err.message);
  }
});

// DELETE HOSPITAL

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM hospitals WHERE hospital_id=$1",

      [req.params.id],
    );

    res.send("Hospital deleted");
  } catch (err) {
    res.send(err.message);
  }
});

// SEARCH HOSPITAL

router.get("/search/:value", async (req, res) => {
  try {
    const value = req.params.value;

    const result = await db.query(
      `

SELECT *

FROM hospitals


WHERE hospital_name ILIKE $1

OR city ILIKE $1

OR hospital_id::text=$2


`,

      [value + "%", value],
    );

    res.json(result.rows);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
