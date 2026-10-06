require('dotenv').config();
const pool = require('./src/config/db');
pool.query("SHOW CREATE PROCEDURE sp_DeleteHoarding").then(([res]) => {
  console.log(res[0]['Create Procedure']);
  process.exit(0);
}).catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
