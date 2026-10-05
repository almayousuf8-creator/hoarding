const mysql = require('mysql2/promise');
mysql.createConnection({host: 'localhost', user: 'root', password: 'root123', database: 'hoarding_leasing'}).then(async (c) => {
  try {
    const [rows] = await c.query("SHOW CREATE PROCEDURE sp_CreateHoarding");
    console.log(rows[0]['Create Procedure']);
    const [rows2] = await c.query("SHOW CREATE PROCEDURE sp_UpdateHoarding");
    console.log(rows2[0]['Create Procedure']);
  } catch(e) {
    console.error(e);
  } finally {
    c.end();
  }
})
