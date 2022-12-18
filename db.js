const mysql = require("mysql2/promise");
const pool = require("./config");

async function query(sql) {
  const results = await pool.query(sql);
  return results[0];
}

module.exports = {
  query,
};
