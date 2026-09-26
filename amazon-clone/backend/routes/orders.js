const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get User Orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();

    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await conn.query(
        'SELECT oi.*, p.title, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    conn.release();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get All Orders (Admin Only)
router.get('/admin/all', verifyAdmin, async (req, res) => {
  try {
    const conn = await global.db.getConnection();

    const [orders] = await conn.query(
      'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );

    conn.release();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Create Order (Checkout)
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, shippingCity, shippingState, shippingZipcode, shippingCountry, paymentMethod, cardNumber } = req.body;

    if (!shippingAddress || !shippingCity || !shippingState || !shippingZipcode) {
      return res.status(400).json({ message: 'All shipping details are required' });
    }

    const conn = await global.db.getConnection();

    // Get cart items
    const [cartItems] = await conn.query(
      'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );

    if (cartItems.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Mock Payment Processing
    const transactionId = `TXN-${Date.now()}`;
    const paymentStatus = 'completed'; // Simulating successful payment

    // Create Order
    const [result] = await conn.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, shipping_city, shipping_state, shipping_zipcode, shipping_country, payment_method, transaction_id, payment_status, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, totalAmount, shippingAddress, shippingCity, shippingState, shippingZipcode, shippingCountry, paymentMethod, transactionId, paymentStatus, 'processing']
    );

    const orderId = result.insertId;

    // Add order items and reduce stock
    for (let item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Reduce product stock
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    conn.release();

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      transactionId,
      totalAmount,
      paymentStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
});

// Get Order Details
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const conn = await global.db.getConnection();

    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await conn.query(
      'SELECT oi.*, p.title, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [orderId]
    );

    conn.release();

    const order = orders[0];
    order.items = items;

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Update Order Status (Admin Only)
router.put('/:orderId/status', verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const conn = await global.db.getConnection();

    const [orders] = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Order not found' });
    }

    await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    conn.release();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

module.exports = router;
