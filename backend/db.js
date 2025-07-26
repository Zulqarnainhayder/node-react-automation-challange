const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://testuser:testpass@localhost:5432/testdb',
});

module.exports = pool;
