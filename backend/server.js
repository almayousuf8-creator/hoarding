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
const stateRoutes = require('./src/routes/states');
const districtRoutes = require('./src/routes/districts');
const clientRoutes = require('./src/routes/clients');
const locationRoutes = require('./src/routes/locations');
const hoardingRoutes = require('./src/routes/hoardings');
const imageRoutes = require('./src/routes/images');
const leadRoutes = require('./src/routes/leads');

app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/hoardings', hoardingRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/leads', leadRoutes);

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
