import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    stock: '',
    image_url: '',
    seller: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    else fetchOrders();
  }, [tab]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (err) {
      setMessage('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setMessage('Failed to load orders');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Product added successfully');
      setFormData({
        title: '',
        description: '',
        price: '',
        discount_price: '',
        category: '',
        stock: '',
        image_url: '',
        seller: ''
      });
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (err) {
        setMessage('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      setMessage('Failed to update order status');
    }
  };

  return (
    <div className="container" style={{ padding: '30px 0' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
        <button
          className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount Price</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Seller</label>
                  <input
                    type="text"
                    name="seller"
                    value={formData.seller}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h3>Products ({products.length})</h3>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {products.map((product) => (
                  <div key={product.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <h4>{product.title}</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      Price: ₹{product.price} | Stock: {product.stock}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>All Orders ({orders.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.name}</td>
                  <td>₹{order.total_amount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
