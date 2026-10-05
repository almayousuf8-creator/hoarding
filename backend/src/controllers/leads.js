const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const query = `INSERT INTO leads (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, [name, email, subject || '', message]);
    res.json({ success: true, message: 'Lead submitted successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const markRead = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE leads SET status = "READ" WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  create,
  markRead,
  remove
};
