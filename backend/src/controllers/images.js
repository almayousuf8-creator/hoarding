const pool = require('../config/db');
const path = require('path');

const uploadImages = async (req, res) => {
  try {
    const hoardingId = req.params.hoardingId;
    const files = req.files;
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No images uploaded' });
      return;
    }
    const values = files.map((file, index) => [hoardingId, `/uploads/${file.filename}`, index]);
    await pool.query('INSERT INTO hoarding_images (hoarding_id, image_path, sort_order) VALUES ?', [values]);
    res.json({ success: true, message: 'Images uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getImages = async (req, res) => {
  try {
    const hoardingId = req.params.hoardingId;
    const [rows] = await pool.query('SELECT * FROM hoarding_images WHERE hoarding_id = ? AND status = "ACTIVE" ORDER BY sort_order ASC', [hoardingId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    await pool.query('UPDATE hoarding_images SET status = "HIDDEN" WHERE id = ?', [imageId]);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { uploadImages, getImages, deleteImage };
