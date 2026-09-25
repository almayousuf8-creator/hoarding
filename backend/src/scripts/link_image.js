const mysql = require('mysql2/promise');
mysql.createConnection({host: 'localhost', user: 'root', password: 'root123', database: 'hoarding_leasing'}).then(async (c) => {
  await c.query("INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES (9, '/uploads/billboard.jpg', 1)");
  console.log('Image linked');
  c.end();
});
