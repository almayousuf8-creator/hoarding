const pool = require('./src/config/db');
pool.query('SELECT name, district, status FROM locations WHERE district LIKE "%Palakkad%"')
  .then(([rows]) => {
    console.table(rows);
    process.exit(0);
  })
  .catch(console.error);
