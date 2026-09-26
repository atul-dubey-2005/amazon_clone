const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Update User Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, zipcode, country } = req.body;

    const conn = await global.db.getConnection();

    await conn.query(
      'UPDATE users SET name=?, phone=?, address=?, city=?, state=?, zipcode=?, country=? WHERE id=?',
      [name, phone, address, city, state, zipcode, country, req.user.id]
    );

    conn.release();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get All Users (Admin Only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const conn = await global.db.getConnection();

    const [users] = await conn.query(
      'SELECT id, name, email, phone, address, city, state, zipcode, country, role, created_at FROM users'
    );

    conn.release();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Delete User (Admin Only)
router.delete('/:userId', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const conn = await global.db.getConnection();

    const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }

    await conn.query('DELETE FROM users WHERE id = ?', [userId]);

    conn.release();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;
