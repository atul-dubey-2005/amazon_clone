const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');

// Get All Products with Search & Filter
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }

    // Sorting
    if (sort === 'price-asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price-desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const conn = await global.db.getConnection();
    const [products] = await conn.query(query, params);
    conn.release();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get Single Product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await global.db.getConnection();
    const [products] = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    conn.release();

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Create Product (Admin Only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, description, price, discount_price, category, stock, image_url, seller } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, price, and category are required' });
    }

    const conn = await global.db.getConnection();

    await conn.query(
      'INSERT INTO products (title, description, price, discount_price, category, stock, image_url, seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, discount_price || price, category, stock || 0, image_url, seller]
    );

    conn.release();

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Update Product (Admin Only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, discount_price, category, stock, image_url, seller } = req.body;

    const conn = await global.db.getConnection();

    // Check if product exists
    const [products] = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Product not found' });
    }

    await conn.query(
      'UPDATE products SET title=?, description=?, price=?, discount_price=?, category=?, stock=?, image_url=?, seller=? WHERE id=?',
      [title, description, price, discount_price || price, category, stock, image_url, seller, id]
    );

    conn.release();

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete Product (Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await global.db.getConnection();

    const [products] = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Product not found' });
    }

    await conn.query('DELETE FROM products WHERE id = ?', [id]);

    conn.release();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Get Categories
router.get('/categories/list', async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [result] = await conn.query('SELECT DISTINCT category FROM products ORDER BY category');
    conn.release();

    const categories = result.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

module.exports = router;
