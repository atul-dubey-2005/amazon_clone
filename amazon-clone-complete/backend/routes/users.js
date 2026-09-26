module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken, verifyAdmin } = require('../middleware/auth');

  router.put('/profile', verifyToken, async (req, res) => {
    const { name, phone, address, city, state, zip } = req.body;
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1, phone = $2, address = $3, city = $4, state = $5, zip = $6 WHERE id = $7 RETURNING *',
        [name, phone, address, city, state, zip, req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/admin/users', verifyAdmin, async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
