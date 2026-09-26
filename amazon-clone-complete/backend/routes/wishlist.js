module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/auth');

  router.post('/', verifyToken, async (req, res) => {
    const { product_id } = req.body;
    try {
      await pool.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.user.id, product_id]
      );
      res.json({ message: 'Added to wishlist' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', verifyToken, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = $1',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:product_id', verifyToken, async (req, res) => {
    try {
      await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.id, req.params.product_id]);
      res.json({ message: 'Removed from wishlist' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
