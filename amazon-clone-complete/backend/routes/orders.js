module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyToken, verifyAdmin } = require('../middleware/auth');

  router.post('/checkout', verifyToken, async (req, res) => {
    const { shipping_address, city, state, zip, coupon_code } = req.body;
    try {
      const cartItems = await pool.query('SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1', [req.user.id]);

      if (cartItems.rows.length === 0) return res.status(400).json({ error: 'Cart is empty' });

      let subtotal = cartItems.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discount = 0;

      if (coupon_code) {
        const coupon = await pool.query('SELECT * FROM coupons WHERE code = $1', [coupon_code]);
        if (coupon.rows.length > 0) {
          discount = (coupon.rows[0].discount_type === 'percentage') 
            ? subtotal * (coupon.rows[0].discount_value / 100) 
            : coupon.rows[0].discount_value;
        }
      }

      const tax = subtotal * 0.18;
      const total = subtotal + tax - discount;

      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, subtotal, tax, discount, total_amount, shipping_address, city, state, zip, status, coupon_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [req.user.id, subtotal, tax, discount, total, shipping_address, city, state, zip, 'pending', coupon_code]
      );

      const orderId = orderResult.rows[0].id;
      for (const item of cartItems.rows) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES ($1, $2, $3, $4, $5, $6)',
          [orderId, item.product_id, item.quantity, item.price, item.size, item.color]
        );
      }

      await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
      res.status(201).json(orderResult.rows[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', verifyToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/admin/all', verifyAdmin, async (req, res) => {
    try {
      const result = await pool.query('SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id/status', verifyAdmin, async (req, res) => {
    const { status } = req.body;
    try {
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
      res.json({ message: 'Status updated' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
