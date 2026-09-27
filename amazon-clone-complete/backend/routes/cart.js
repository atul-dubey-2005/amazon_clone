module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/auth');

  router.get('/', verifyToken, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT c.*, p.name, p.price, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/', verifyToken, async (req, res) => {
    const { product_id, quantity, size, color } = req.body;
    try {
      const existing = await pool.query(
        'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 AND size IS NOT DISTINCT FROM $3 AND color IS NOT DISTINCT FROM $4',
        [req.user.id, product_id, size || null, color || null]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          'UPDATE cart SET quantity = quantity + $1 WHERE id = $2',
          [quantity, existing.rows[0].id]
        );
      } else {
        await pool.query(
          'INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES ($1, $2, $3, $4, $5)',
          [req.user.id, product_id, quantity, size || null, color || null]
        );
      }
      res.json({ message: 'Added to cart' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', verifyToken, async (req, res) => {
    const { quantity } = req.body;
    try {
      await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3', [quantity, req.params.id, req.user.id]);
      res.json({ message: 'Updated' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      res.json({ message: 'Removed from cart' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
