const mysql = require('mysql2/promise');
mysql.createConnection({host: 'localhost', user: 'root', password: 'root123', database: 'hoarding_leasing'}).then(async (c) => {
  try {
    await c.query("INSERT IGNORE INTO states (id, name) VALUES (1, 'Kerala')");
    await c.query("INSERT IGNORE INTO districts (id, state_id, name) VALUES (1, 1, 'Ernakulam')");
    await c.query("INSERT IGNORE INTO clients (id, name) VALUES (1, 'Default Client')");
    await c.query("INSERT IGNORE INTO locations (id, district_id, client_id, name) VALUES (1, 1, 1, 'Kakkanad')");
    await c.query("INSERT IGNORE INTO locations (id, district_id, client_id, name) VALUES (2, 1, 1, 'Ernakulam Central')");
    console.log("Seeded successfully");
  } catch(e) {
    console.error(e);
  } finally {
    c.end();
  }
});
