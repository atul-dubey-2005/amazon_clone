const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (WITH SSL FOR SUPABASE)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }  // ✅ CRITICAL FOR SUPABASE
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected:', res.rows[0]);
  }
});

// Routes
app.use('/api/auth', require('./routes/auth')(pool));
app.use('/api/products', require('./routes/products')(pool));
app.use('/api/cart', require('./routes/cart')(pool));
app.use('/api/orders', require('./routes/orders')(pool));
app.use('/api/reviews', require('./routes/reviews')(pool));
app.use('/api/wishlist', require('./routes/wishlist')(pool));
app.use('/api/coupons', require('./routes/coupons')(pool));
app.use('/api/returns', require('./routes/returns')(pool));
app.use('/api/users', require('./routes/users')(pool));
app.use('/api/notifications', require('./routes/notifications')(pool));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
