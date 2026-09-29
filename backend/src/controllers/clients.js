const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT c.*, h.name as hoarding_name, h.amount as hoarding_amount, h.occupied_till as hoarding_occupied_till FROM clients c LEFT JOIN hoardings h ON c.hoarding_id = h.id');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT c.*, h.name as hoarding_name, h.amount as hoarding_amount, h.occupied_till as hoarding_occupied_till FROM clients c LEFT JOIN hoardings h ON c.hoarding_id = h.id WHERE c.id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Client not found' });
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
    const fields = Object.keys(body).filter(k => ["name","email","phone","address","hoarding_id","status"].includes(k));
    const values = fields.map(k => body[k]);
    const placeholders = fields.map(() => '?').join(', ');
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }
    const query = `INSERT INTO clients (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(query, values);
    if (body.hoarding_id && body.status !== 'HIDDEN') {
      const amount = body.payment || null;
      const occupied_till = body.occupied_till || null;
      await pool.query('UPDATE hoardings SET availability_status = "OCCUPIED", amount = COALESCE(?, amount), occupied_till = COALESCE(?, occupied_till) WHERE id = ?', [amount, occupied_till, body.hoarding_id]);
    }
    res.json({ success: true, message: 'Client created successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    const body = req.body;
    const [oldClientRows] = await pool.query('SELECT hoarding_id, status FROM clients WHERE id = ?', [req.params.id]);
    if (oldClientRows.length === 0) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    const oldClient = oldClientRows[0];
    const fields = Object.keys(body).filter(k => ["name","email","phone","address","hoarding_id","status"].includes(k));
    const values = fields.map(k => body[k]);
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }
    const setClause = fields.map(k => `${k} = ?`).join(', ');
    const query = `UPDATE clients SET ${setClause} WHERE id = ?`;
    values.push(req.params.id);
    await pool.query(query, values);
    if (oldClient.hoarding_id) {
      const statusBecameHidden = body.status === 'HIDDEN' && oldClient.status !== 'HIDDEN';
      const hoardingChanged = body.hoarding_id !== oldClient.hoarding_id && Number(body.hoarding_id) !== oldClient.hoarding_id;
      if (statusBecameHidden || hoardingChanged || body.status === 'HIDDEN') {
        await pool.query('UPDATE hoardings SET availability_status = "AVAILABLE", occupied_till = NULL WHERE id = ?', [oldClient.hoarding_id]);
      }
    }
    if (body.hoarding_id && body.status !== 'HIDDEN') {
      const amount = body.payment !== undefined ? body.payment : null;
      const occupied_till = body.occupied_till !== undefined ? body.occupied_till : null;
      let updates = ['availability_status = "OCCUPIED"'];
      let vals = [];
      if (amount !== null) { updates.push('amount = ?'); vals.push(amount); }
      if (occupied_till !== null) { updates.push('occupied_till = ?'); vals.push(occupied_till); }
      vals.push(body.hoarding_id);
      await pool.query(`UPDATE hoardings SET ${updates.join(', ')} WHERE id = ?`, vals);
    }
    res.json({ success: true, message: 'Client updated successfully' });
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
    const [result] = await pool.query('UPDATE clients SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, message: 'Client status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    const [client] = await pool.query('SELECT hoarding_id FROM clients WHERE id = ?', [req.params.id]);
    let hoardingId = null;
    if (client && client.length > 0) {
      hoardingId = client[0].hoarding_id;
    }
    const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    if (hoardingId) {
      await pool.query('UPDATE hoardings SET availability_status = "AVAILABLE", occupied_till = NULL WHERE id = ?', [hoardingId]);
      res.json({ success: true, message: 'Client deleted successfully. The booked hoarding is now available for other clients.', hoardingFreed: true });
    } else {
      res.json({ success: true, message: 'Client deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ success: false, message: 'Cannot delete client because it has linked records.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { occupied_till } = req.body;
    const [client] = await pool.query('SELECT hoarding_id FROM clients WHERE id = ?', [req.params.id]);
    if (client.length === 0) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    const hoardingId = client[0].hoarding_id;
    if (!hoardingId) {
      res.status(400).json({ success: false, message: 'Client is not interested in any hoarding' });
      return;
    }
    await pool.query('UPDATE hoardings SET availability_status = "OCCUPIED", occupied_till = ? WHERE id = ?', [occupied_till || null, hoardingId]);
    res.json({ success: true, message: 'Booking confirmed successfully. Hoarding marked as occupied.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, create, update, updateStatus, remove, confirmBooking };
