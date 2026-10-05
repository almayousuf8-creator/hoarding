const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors({
  origin: [
    'https://hoarding.trackbox.in',
    'http://localhost:4200'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = require('./src/config/db');

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      message: 'Backend is running and Database is connected',
      database: {
        status: 'connected',
        name: process.env.DB_NAME || 'hoarding',
        host: process.env.DB_HOST || '127.0.0.1'
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: err.message
    });
  }
});

const authRoutes = require('./src/routes/auth');

const clientRoutes = require('./src/routes/clients');
const locationRoutes = require('./src/routes/locations');
const hoardingRoutes = require('./src/routes/hoardings');
const imageRoutes = require('./src/routes/images');

app.use('/api/auth', authRoutes);

app.use('/api/clients', clientRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/hoardings', hoardingRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const connection = await pool.getConnection();
    console.log(`Database connected successfully to "${process.env.DB_NAME || 'hoarding'}" on ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`);
    connection.release();
  } catch (error) {
    console.error(`Database connection failed:`, error.message);
  }
});

// Run every hour to check and update expired hoardings
const cron = require('node-cron');
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running scheduled job: Auto-expiring hoardings...');
    const [result] = await pool.query('UPDATE hoardings SET availability_status = "AVAILABLE", occupied_till = NULL WHERE availability_status = "OCCUPIED" AND occupied_till < CURDATE()');
    if (result.affectedRows > 0) {
      console.log(`Auto-expired ${result.affectedRows} hoardings.`);
    }
  } catch (error) {
    console.error('Error auto-expiring hoardings:', error.message);
  }
});
