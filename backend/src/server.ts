import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import pool from './config/db';

// Simple test route with DB health check
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
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: err.message
    });
  }
});

import authRoutes from './routes/auth';
import stateRoutes from './routes/states';
import districtRoutes from './routes/districts';
import clientRoutes from './routes/clients';
import locationRoutes from './routes/locations';
import hoardingRoutes from './routes/hoardings';
import imageRoutes from './routes/images';

app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
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
  } catch (error: any) {
    console.error(`Database connection failed:`, error.message);
  }
});
