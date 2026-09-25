import pool from '../config/db';
import bcrypt from 'bcrypt';

async function seedDb() {
  try {
    const connection = await pool.getConnection();

    const adminHash = await bcrypt.hash('admin123', 10);
    const clientHash = await bcrypt.hash('client123', 10);

    // Create Client
    const [clientRes]: any = await connection.query(
        'INSERT IGNORE INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)',
        ['ABC Media', 'abc@example.com', '9876543210', 'Kerala']
    );
    const clientId = clientRes.insertId || 1;

    // Create Users
    await connection.query(
      'INSERT IGNORE INTO users (name, email, password_hash, role, client_id) VALUES (?, ?, ?, ?, ?)',
      ['Admin User', 'admin@hoarding.com', adminHash, 'ADMIN', null]
    );

    await connection.query(
      'INSERT IGNORE INTO users (name, email, password_hash, role, client_id) VALUES (?, ?, ?, ?, ?)',
      ['Client User', 'client@hoarding.com', clientHash, 'CLIENT', clientId]
    );

    // Create States
    await connection.query('INSERT IGNORE INTO states (name) VALUES ("Kerala"), ("Tamil Nadu"), ("Karnataka")');

    console.log('Database seeded successfully.');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDb();
