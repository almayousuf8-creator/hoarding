const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'hoarding_leasing',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createLead = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }
    await pool.query('INSERT INTO leads (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject || null, message || null]);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getLeads = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const markLeadAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE leads SET status = "READ" WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Lead marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteLead = async (req, res) => {
  try {
    await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createLead, getLeads, markLeadAsRead, deleteLead };
