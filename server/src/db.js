require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
});

/**
 * Run a parameterized SQL query against the database.
 */
async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Verify that the database connection is working.
 */
async function testConnection() {
  const result = await query("SELECT NOW() AS now");
  return result.rows[0];
}

module.exports = {
  pool,
  query,
  testConnection,
};
