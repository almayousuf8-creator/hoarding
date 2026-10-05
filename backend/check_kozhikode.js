const pool = require('./src/config/db');
pool.query('SELECT h.id, h.name, h.availability_status, l.name as loc_name FROM hoardings h LEFT JOIN locations l ON h.location_id = l.id WHERE l.name LIKE "%kozhikode%"')
  .then(([rows]) => {
    console.table(rows);
    process.exit(0);
  })
  .catch(console.error);
