import { Request, Response } from 'express';
import pool from '../config/db';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, c.name as client_name, d.name as district_name 
      FROM locations l 
      LEFT JOIN clients c ON l.client_id = c.id
      LEFT JOIN districts d ON l.district_id = d.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Location not found' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const fields = Object.keys(body).filter(k => ["district_id","client_id","name","description","latitude","longitude","google_maps_url","status"].includes(k));
    const values = fields.map(k => body[k]);
    const placeholders = fields.map(() => '?').join(', ');
    
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }

    const query = `INSERT INTO locations (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result]: any = await pool.query(query, values);
    
    res.json({ success: true, message: 'Location created successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const fields = Object.keys(body).filter(k => ["district_id","client_id","name","description","latitude","longitude","google_maps_url","status"].includes(k));
    const values = fields.map(k => body[k]);
    
    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields provided' });
      return;
    }

    const setClause = fields.map(k => `${k} = ?`).join(', ');
    const query = `UPDATE locations SET ${setClause} WHERE id = ?`;
    values.push(req.params.id);
    
    const [result]: any = await pool.query(query, values);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Location not found' });
      return;
    }
    
    res.json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'HIDDEN'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }
    
    const [result]: any = await pool.query('UPDATE locations SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Location not found' });
      return;
    }
    
    res.json({ success: true, message: 'Location status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const [result]: any = await pool.query('DELETE FROM locations WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Location not found' });
      return;
    }
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ success: false, message: 'Cannot delete location because it has linked records.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
