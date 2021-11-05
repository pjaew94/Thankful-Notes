import dotenv from "dotenv";
const Pool = require("pg").Pool

dotenv.config();

const pool = new Pool({
    user: "postgres",
    password: process.env.POOLPASSWORD,
    host: process.env.POOLHOST,
    port: process.env.POOLPORT,
    database: process.env.POOLDATABASE
})

module.exports = pool;