module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken } = require('../middleware/auth');

  router.get('/', verifyToken, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id/read', verifyToken, async (req, res) => {
    try {
      await pool.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      res.json({ message: 'Marked as read' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
