const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hoarding_leasing',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    
    // Drop existing foreign key. Need to find its name first.
    const [fkRows] = await connection.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'locations' AND COLUMN_NAME = 'client_id' AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    if (fkRows.length > 0) {
      const fkName = fkRows[0].CONSTRAINT_NAME;
      await connection.query(`ALTER TABLE locations DROP FOREIGN KEY ${fkName}`);
    }

    // Alter column to be nullable
    await connection.query(`ALTER TABLE locations MODIFY client_id INT NULL`);

    // Add foreign key with ON DELETE SET NULL
    await connection.query(`ALTER TABLE locations ADD CONSTRAINT fk_location_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL`);

    console.log("Updated locations table foreign key constraint to ON DELETE SET NULL.");

    // Also update clients delete controller to show a message if a booked billboard is freed?
    // Wait, let's just make it ON DELETE SET NULL first.
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
