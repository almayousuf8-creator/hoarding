const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hoarding_leasing'
  });
  
  await conn.query('DROP PROCEDURE IF EXISTS sp_CreateHoarding;');
  await conn.query('CREATE PROCEDURE sp_CreateHoarding(' +
      'IN p_location_id INT,' +
      'IN p_name VARCHAR(100),' +
      'IN p_description TEXT,' +
      'IN p_dimensions VARCHAR(50),' +
      'IN p_availability_status ENUM(\'AVAILABLE\',\'OCCUPIED\',\'MAINTENANCE\'),' +
      'IN p_occupied_till DATE,' +
      'IN p_amount DECIMAL(10,2),' +
      'IN p_latitude DECIMAL(10,8),' +
      'IN p_longitude DECIMAL(11,8),' +
      'IN p_google_maps_url TEXT,' +
      'IN p_status ENUM(\'ACTIVE\',\'INACTIVE\'),' +
      'IN p_facing VARCHAR(150)' +
    ') BEGIN ' +
      'INSERT INTO hoardings (location_id, name, description, dimensions, availability_status, occupied_till, amount, latitude, longitude, google_maps_url, status, facing) ' +
      'VALUES (p_location_id, p_name, p_description, p_dimensions, p_availability_status, p_occupied_till, p_amount, p_latitude, p_longitude, p_google_maps_url, p_status, p_facing); ' +
      'SELECT LAST_INSERT_ID() AS insertId; ' +
    'END');
  
  await conn.query('DROP PROCEDURE IF EXISTS sp_UpdateHoarding;');
  await conn.query('CREATE PROCEDURE sp_UpdateHoarding(' +
      'IN p_id INT,' +
      'IN p_location_id INT,' +
      'IN p_name VARCHAR(100),' +
      'IN p_description TEXT,' +
      'IN p_dimensions VARCHAR(50),' +
      'IN p_availability_status ENUM(\'AVAILABLE\',\'OCCUPIED\',\'MAINTENANCE\'),' +
      'IN p_occupied_till DATE,' +
      'IN p_amount DECIMAL(10,2),' +
      'IN p_latitude DECIMAL(10,8),' +
      'IN p_longitude DECIMAL(11,8),' +
      'IN p_google_maps_url TEXT,' +
      'IN p_status ENUM(\'ACTIVE\',\'INACTIVE\'),' +
      'IN p_facing VARCHAR(150)' +
    ') BEGIN ' +
      'UPDATE hoardings SET ' +
        'location_id = COALESCE(p_location_id, location_id),' +
        'name = COALESCE(p_name, name),' +
        'description = p_description,' +
        'dimensions = p_dimensions,' +
        'availability_status = COALESCE(p_availability_status, availability_status),' +
        'occupied_till = p_occupied_till,' +
        'amount = p_amount,' +
        'latitude = p_latitude,' +
        'longitude = p_longitude,' +
        'google_maps_url = p_google_maps_url,' +
        'status = COALESCE(p_status, status),' +
        'facing = p_facing ' +
      'WHERE id = p_id; ' +
    'END');
  console.log('Stored procedures updated');
  conn.end();
}
run();
