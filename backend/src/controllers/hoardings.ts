import { Request, Response } from 'express';
import pool from '../config/db';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT h.*, l.name as location_name, c.name as client_name,
      (SELECT image_path FROM hoarding_images WHERE hoarding_id = h.id ORDER BY sort_order ASC LIMIT 1) as primary_image
      FROM hoardings h 
      LEFT JOIN locations l ON h.location_id = l.id 
      LEFT JOIN clients c ON l.client_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(`
      SELECT h.*, l.name as location_name, c.name as client_name,
      (SELECT image_path FROM hoarding_images WHERE hoarding_id = h.id ORDER BY sort_order ASC LIMIT 1) as primary_image
      FROM hoardings h 
      LEFT JOIN locations l ON h.location_id = l.id 
      LEFT JOIN clients c ON l.client_id = c.id
      WHERE h.id = ?
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

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location_id, name, description, availability_status, occupied_till,
      amount, latitude, longitude, google_maps_url, status
    } = req.body;
    
    const query = `CALL sp_CreateHoarding(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      location_id || 1, name || '', description || '', availability_status || 'AVAILABLE',
      occupied_till || null, amount || 0, latitude || null, longitude || null,
      google_maps_url || null, status || 'ACTIVE'
    ];
    
    const [result]: any = await pool.query(query, values);
    const insertId = result[0][0].insertId;
    
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      await pool.query('INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES (?, ?, ?)', [insertId, imagePath, 1]);
    }
    
    res.json({ success: true, message: 'Hoarding created successfully via SP', data: { id: insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location_id, name, description, availability_status, occupied_till,
      amount, latitude, longitude, google_maps_url, status
    } = req.body;
    
    const query = `CALL sp_UpdateHoarding(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      req.params.id, location_id || 1, name || '', description || '', 
      availability_status || 'AVAILABLE', occupied_till || null, amount || 0, 
      latitude || null, longitude || null, google_maps_url || null, status || 'ACTIVE'
    ];
    
    const [result]: any = await pool.query(query, values);
    
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      // Check if image exists
      const [existing]: any = await pool.query('SELECT id FROM hoarding_images WHERE hoarding_id = ?', [req.params.id]);
      if (existing.length > 0) {
        await pool.query('UPDATE hoarding_images SET image_path = ? WHERE hoarding_id = ?', [imagePath, req.params.id]);
      } else {
        await pool.query('INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES (?, ?, ?)', [req.params.id, imagePath, 1]);
      }
    }
    
    res.json({ success: true, message: 'Hoarding updated successfully via SP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `CALL sp_DeleteHoarding(?)`;
    const [result]: any = await pool.query(query, [req.params.id]);
    
    res.json({ success: true, message: 'Hoarding deleted successfully via SP' });
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
    
    const [result]: any = await pool.query('UPDATE hoardings SET status = ? WHERE id = ?', [status, req.params.id]);
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
