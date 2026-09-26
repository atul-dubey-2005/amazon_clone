const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Get Cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();

    const query = `
      SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.discount_price, p.image_url, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.added_at DESC
    `;

    const [cartItems] = await conn.query(query, [req.user.id]);
    conn.release();

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

// Add to Cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product_id or quantity' });
    }

    const conn = await global.db.getConnection();

    // Check product exists
    const [products] = await conn.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Product not found' });
    }

    if (products[0].stock < quantity) {
      conn.release();
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item exists in cart
    const [cartItems] = await conn.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (cartItems.length > 0) {
      // Update quantity
      await conn.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      // Add new item
      await conn.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    conn.release();

    res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to cart', error: error.message });
  }
});

// Update Cart Item
router.put('/update/:product_id', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const conn = await global.db.getConnection();

    if (quantity === 0) {
      // Remove item
      await conn.query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );
    } else {
      // Update quantity
      await conn.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    }

    conn.release();

    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
});

// Remove from Cart
router.delete('/:product_id', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.params;

    const conn = await global.db.getConnection();

    await conn.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    conn.release();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
  }
});

// Clear Cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();

    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    conn.release();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
});

module.exports = router;
