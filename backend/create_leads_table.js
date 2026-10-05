require('dotenv').config();
const pool = require('./src/config/db');
const q = `CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('NEW', 'READ') DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
pool.query(q).then(() => {
  console.log('Leads table created');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
