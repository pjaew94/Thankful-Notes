const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "Wnstjd77+",
    host: "localhost",
    port: 5555,
    database: "thankfulnotes"
})

module.exports = pool;