module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();

  router.post('/validate', async (req, res) => {
    const { code, subtotal } = req.body;
    try {
      const result = await pool.query(
        'SELECT * FROM coupons WHERE code = $1 AND valid_until > NOW()',
        [code]
      );
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired coupon' });
      }
      const coupon = result.rows[0];
      const discount = coupon.discount_type === 'percentage' 
        ? subtotal * (coupon.discount_value / 100) 
        : coupon.discount_value;
      res.json({ discount, coupon });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
