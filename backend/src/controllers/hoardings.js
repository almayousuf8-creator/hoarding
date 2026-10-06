const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    // Auto-expire hoardings whose occupied_till date has passed
    await pool.query('UPDATE hoardings SET availability_status = "AVAILABLE", occupied_till = NULL WHERE availability_status = "OCCUPIED" AND occupied_till < CURDATE()');

    const [rows] = await pool.query(`
      SELECT h.*, l.name as location_name,
      l.status as loc_status,
      (SELECT name FROM clients WHERE hoarding_id = h.id AND status = 'ACTIVE' ORDER BY id DESC LIMIT 1) as client_name,
      (SELECT image_path FROM hoarding_images WHERE hoarding_id = h.id AND status = 'ACTIVE' ORDER BY sort_order ASC LIMIT 1) as primary_image,
      (SELECT GROUP_CONCAT(image_path ORDER BY sort_order ASC SEPARATOR ',') FROM hoarding_images WHERE hoarding_id = h.id AND status = 'ACTIVE') as all_images
      FROM hoardings h 
      LEFT JOIN locations l ON h.location_id = l.id
      WHERE h.is_deleted = 0
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getById = async (req, res) => {
  try {
    // Auto-expire hoardings whose occupied_till date has passed
    await pool.query('UPDATE hoardings SET availability_status = "AVAILABLE", occupied_till = NULL WHERE availability_status = "OCCUPIED" AND occupied_till < CURDATE()');

    const [rows] = await pool.query(`
      SELECT h.*, l.name as location_name, 
      (SELECT name FROM clients WHERE hoarding_id = h.id AND status = 'ACTIVE' ORDER BY id DESC LIMIT 1) as client_name,
      (SELECT image_path FROM hoarding_images WHERE hoarding_id = h.id AND status = 'ACTIVE' ORDER BY sort_order ASC LIMIT 1) as primary_image,
      (SELECT GROUP_CONCAT(image_path ORDER BY sort_order ASC SEPARATOR ',') FROM hoarding_images WHERE hoarding_id = h.id AND status = 'ACTIVE') as all_images
      FROM hoardings h 
      LEFT JOIN locations l ON h.location_id = l.id 
      WHERE h.id = ? AND h.is_deleted = 0
    `, [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Hoarding not found' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { location_id, name, description, dimensions, availability_status, occupied_till, latitude, longitude, google_maps_url, status, state, district } = req.body;
    const query = `CALL sp_CreateHoarding(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      location_id || 1, name || '', description || '', dimensions || '', availability_status || 'AVAILABLE',
      occupied_till || null, latitude || null, longitude || null,
      google_maps_url || null, status || 'ACTIVE', state || '', district || ''
    ];
    const [result] = await pool.query(query, values);
    const insertId = result[0][0].insertId;
    // Support multiple files
    const files = req.files || (req.file ? [req.file] : []);
    for (let i = 0; i < files.length; i++) {
      const imagePath = `/uploads/${files[i].filename}`;
      await pool.query('INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES (?, ?, ?)', [insertId, imagePath, i + 1]);
    }
    res.json({ success: true, message: 'Hoarding created successfully via SP', data: { id: insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    const { location_id, name, description, dimensions, availability_status, occupied_till, latitude, longitude, google_maps_url, status, state, district } = req.body;
    const query = `CALL sp_UpdateHoarding(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      req.params.id, location_id || 1, name || '', description || '', dimensions || '',
      availability_status || 'AVAILABLE', occupied_till || null, 
      latitude || null, longitude || null, google_maps_url || null, status || 'ACTIVE',
      state || '', district || ''
    ];
    await pool.query(query, values);
    // Support multiple files — append new images
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length > 0) {
      const [existing] = await pool.query('SELECT MAX(sort_order) as maxOrder FROM hoarding_images WHERE hoarding_id = ?', [req.params.id]);
      let nextOrder = (existing[0].maxOrder || 0) + 1;
      for (const file of files) {
        const imagePath = `/uploads/${file.filename}`;
        await pool.query('INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES (?, ?, ?)', [req.params.id, imagePath, nextOrder++]);
      }
    }
    res.json({ success: true, message: 'Hoarding updated successfully via SP' });
  } catch (error) {
    console.error(error);
    require('fs').appendFileSync('error.log', new Date().toISOString() + ' ' + error.stack + '\n');
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await pool.query(`CALL sp_DeleteHoarding(?)`, [req.params.id]);
    res.json({ success: true, message: 'Hoarding deleted successfully via SP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'HIDDEN'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }
    const [result] = await pool.query('UPDATE hoardings SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Hoarding not found' });
      return;
    }
    res.json({ success: true, message: 'Hoarding status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { availability_status, occupied_till } = req.body;
    if (!['AVAILABLE', 'OCCUPIED'].includes(availability_status)) {
      res.status(400).json({ success: false, message: 'Invalid availability status' });
      return;
    }
    
    // Auto-nullify occupied_till if AVAILABLE
    const finalOccupiedTill = (availability_status === 'AVAILABLE') ? null : (occupied_till || null);

    const [result] = await pool.query(
      'UPDATE hoardings SET availability_status = ?, occupied_till = ? WHERE id = ?', 
      [availability_status, finalOccupiedTill, req.params.id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Hoarding not found' });
      return;
    }
    res.json({ success: true, message: 'Hoarding availability updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, create, update, remove, updateStatus, updateAvailability };
