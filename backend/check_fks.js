require('dotenv').config();
const pool = require('./src/config/db');

pool.query("SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = 'hoardings'").then(([res]) => {
  console.log(res);
  process.exit(0);
}).catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
