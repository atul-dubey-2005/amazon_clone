module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/auth');

  router.post('/', verifyToken, async (req, res) => {
    const { product_id, rating, title, comment } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase) VALUES ($1, $2, $3, $4, $5, true) RETURNING *',
        [product_id, req.user.id, rating, title, comment]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/product/:product_id', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT r.*, u.name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
        [req.params.product_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
