const pool = require('../config/db').default;

async function updateDb() {
  try {
    const connection = await pool.getConnection();
    
    // Check if hoarding_id column exists in clients table
    const [rows] = await connection.query(`SHOW COLUMNS FROM clients LIKE 'hoarding_id'`);
    if (rows.length === 0) {
      await connection.query(`ALTER TABLE clients ADD COLUMN hoarding_id INT DEFAULT NULL`);
      try {
        await connection.query(`ALTER TABLE clients ADD CONSTRAINT fk_client_hoarding FOREIGN KEY (hoarding_id) REFERENCES hoardings(id) ON DELETE SET NULL`);
      } catch (e: any) {
        console.log("FK constraint might already exist or error:", e.message);
      }
      console.log("Added hoarding_id to clients.");
    } else {
      console.log("hoarding_id already exists in clients.");
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateDb();
