import express from "express";
import { groupValidation } from "./../middleware/validation";
const pool = require("../db");

const router = express.Router();

// Create New Group
router.post("/", async (req, res) => {
  const { error } = groupValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    try {
      const { unique_group_name, group_name } = req.body;

      const group = await pool.query(
        "SELECT * FROM groups WHERE unique_group_name = $1",
        [unique_group_name]
      );

      if (group.rows.length !== 0) {
        return res.status(401).send("That unique group name already exists!");
      }

      const newGroup = await pool.query(
        "INSERT INTO groups(unique_group_name, group_name) VALUES ($1, $2) RETURNING *",
        [unique_group_name, group_name]
      );

      return res.json(newGroup.rows[0])
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
});

module.exports = router;
