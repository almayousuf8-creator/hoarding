const pool = require('./src/config/db');
pool.query("ALTER TABLE clients MODIFY COLUMN status ENUM('ACTIVE','HIDDEN','UNDER REVIEW') DEFAULT 'UNDER REVIEW'")
  .then(() => { 
    console.log('Successfully altered table default.'); 
    process.exit(0); 
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
