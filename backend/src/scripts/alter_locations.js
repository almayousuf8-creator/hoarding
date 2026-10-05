const mysql = require('mysql2/promise');
mysql.createConnection({host: 'localhost', user: 'root', password: 'root123', database: 'hoarding_leasing'}).then(async (c) => {
  try {
    try {
      await c.query("ALTER TABLE locations ADD COLUMN state VARCHAR(255) DEFAULT ''");
      await c.query("ALTER TABLE locations ADD COLUMN district VARCHAR(255) DEFAULT ''");
    } catch(e) {
      console.log("Columns may already exist:", e.message);
    }
    console.log("Altered locations table successfully");
  } catch(e) {
    console.error(e);
  } finally {
    c.end();
  }
});
