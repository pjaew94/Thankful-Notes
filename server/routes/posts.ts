import express from "express";
const pool = require("../db");

const router = express.Router()

router.get('/', (req, res) => {
    res.send('posts')
})

module.exports = router