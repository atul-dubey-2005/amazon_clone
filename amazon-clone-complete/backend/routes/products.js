module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { verifyAdmin } = require('../middleware/auth');

  router.get('/', async (req, res) => {
    const { category, minPrice, maxPrice, search, sort, page = 1 } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= $' + (params.length + 1);
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= $' + (params.length + 1);
      params.push(maxPrice);
    }
    if (search) {
      query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 2) + ')';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'price-low') query += ' ORDER BY price ASC';
    else if (sort === 'price-high') query += ' ORDER BY price DESC';
    else if (sort === 'newest') query += ' ORDER BY created_at DESC';
    else query += ' ORDER BY name ASC';

    query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
      const variants = await pool.query('SELECT * FROM product_variants WHERE product_id = $1', [req.params.id]);
      res.json({ ...product.rows[0], variants: variants.rows });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/', verifyAdmin, async (req, res) => {
    const { name, description, price, category, stock, brand } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, category, stock, brand) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description, price, category, stock, brand]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/category/list', async (req, res) => {
    try {
      const result = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
      res.json(result.rows.map(r => r.category));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
