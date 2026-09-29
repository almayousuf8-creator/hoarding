const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT d.*, s.name as state_name FROM districts d LEFT JOIN states s ON d.state_id = s.id');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM districts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'District not found' });
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
    const body = req.body;
    const fields = Object.keys(body).filter(k => ["state_id","name","status"].includes(k));
    const values = fields.map(k => body[k]);
    const placeholders = fields.map(() => '?').join(', ');
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }
    const query = `INSERT INTO districts (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(query, values);
    res.json({ success: true, message: 'District created successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    const body = req.body;
    const fields = Object.keys(body).filter(k => ["state_id","name","status"].includes(k));
    const values = fields.map(k => body[k]);
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }
    const setClause = fields.map(k => `${k} = ?`).join(', ');
    const query = `UPDATE districts SET ${setClause} WHERE id = ?`;
    values.push(req.params.id);
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'District not found' });
      return;
    }
    res.json({ success: true, message: 'District updated successfully' });
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
    const [result] = await pool.query('UPDATE districts SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'District not found' });
      return;
    }
    res.json({ success: true, message: 'District status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM districts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'District not found' });
      return;
    }
    res.json({ success: true, message: 'District deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ success: false, message: 'Cannot delete district because it has linked records.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, create, update, updateStatus, remove };
