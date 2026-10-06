require('dotenv').config();
const pool = require('./src/config/db');

async function fixConstraints() {
  try {
    // Fix hoarding_images constraint
    await pool.query("ALTER TABLE hoarding_images DROP FOREIGN KEY hoarding_images_ibfk_1");
    await pool.query("ALTER TABLE hoarding_images ADD CONSTRAINT hoarding_images_ibfk_1 FOREIGN KEY (hoarding_id) REFERENCES hoardings(id) ON DELETE CASCADE");
    console.log('Fixed hoarding_images fk');

    // Fix clients constraint
    await pool.query("ALTER TABLE clients DROP FOREIGN KEY fk_client_hoarding");
    await pool.query("ALTER TABLE clients ADD CONSTRAINT fk_client_hoarding FOREIGN KEY (hoarding_id) REFERENCES hoardings(id) ON DELETE SET NULL");
    console.log('Fixed clients fk');
    
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

fixConstraints();
