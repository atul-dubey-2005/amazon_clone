module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/auth');

  router.post('/', verifyToken, async (req, res) => {
    const { order_id, reason, description } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO returns (order_id, user_id, reason, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [order_id, req.user.id, reason, description, 'initiated']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', verifyToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM returns WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
