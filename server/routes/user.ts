import express from "express";
import bcrypt from "bcrypt";
import { loginValidation, registerValidation } from "../middleware/validation";
import { jwtGenerator } from "../middleware/authentication";
const authorization = require('../middleware/authorization')


const pool = require("../db");

const router = express.Router();

// Get User's Self Information - FINISH
router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT group_id, is_in_group, first_name, last_name,age, email, date_joined FROM users WHERE id = $1", [req.user])
        res.status(200).json(user.rows[0])
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error");
    }
});

// Register User - FINISH
router.post("/", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    try {
      const {
        group_id,
        first_name,
        last_name,
        age,
        email,
        password,
        date_joined,
      } = req.body;

      //Checks to see if user with the same email already exists
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length !== 0) {
        return res.status(401).send("User already exists");
      }

      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);

      const bcryptPassword = await bcrypt.hash(password, salt);

      const isInGroup = group_id ? true : false;

      const newUser = await pool.query(
        "INSERT INTO users(is_in_group, group_id, first_name, last_name, age, email, password, date_joined) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          isInGroup,
          group_id,
          first_name,
          last_name,
          age,
          email,
          bcryptPassword,
          date_joined,
        ]
      );

      const token = jwtGenerator(newUser.rows[0].id);

      return res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
});

// Login User - FINISH
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    try {
      const { email, password } = req.body;

      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
          email
      ]);

      if(user.rows.length === 0) {
          return res.status(401).json("User with the following email and password combination does not exist.")
      }

      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if(!validPassword) {
        return res.status(401).json("User with the following email and password combination does not exist.")
      }

      const token = jwtGenerator(user.rows[0].id);

      return res.json({token})
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
});

// Verify User - FINISH
router.get('/check/is-verify', authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        res.status(500).send("Server Error");
    }
})

// Delete User - FINISH
router.delete("/", authorization, async(req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [
            req.user
        ])
        res.status(200).send("User has been deleted")
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error");
    }
})

module.exports = router;
