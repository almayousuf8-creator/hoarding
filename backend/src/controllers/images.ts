import { Request, Response } from 'express';
import pool from '../config/db';
import path from 'path';

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const hoardingId = req.params.hoardingId;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No images uploaded' });
      return;
    }

    const values = files.map((file, index) => [
      hoardingId,
      `/uploads/${file.filename}`,
      index
    ]);

    await pool.query(
      'INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES ?',
      [values]
    );

    res.json({ success: true, message: 'Images uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const hoardingId = req.params.hoardingId;
      const [rows] = await pool.query('SELECT * FROM hoarding_images WHERE hoarding_id = ? AND status = "ACTIVE" ORDER BY sort_order ASC', [hoardingId]);
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const imageId = req.params.imageId;
      await pool.query('UPDATE hoarding_images SET status = "HIDDEN" WHERE id = ?', [imageId]);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
