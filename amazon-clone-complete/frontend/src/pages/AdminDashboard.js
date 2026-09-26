import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', brand: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added!');
      setForm({ name: '', description: '', price: '', category: '', stock: '', brand: '' });
      fetchProducts();
    } catch (error) {
      alert('Error adding product');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  return (
    <div className="page container">
      <h1>Admin Dashboard</h1>
      
      <section>
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
          <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
          <input type="text" placeholder="Brand" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} />
          <button type="submit">Add Product</button>
        </form>
      </section>

      <section>
        <h2>All Products</h2>
        <table className="orders-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td><button onClick={() => deleteProduct(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>All Orders</h2>
        <table className="orders-table">
          <thead>
            <tr><th>ID</th><th>User</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.name}</td>
                <td>₹{o.total_amount}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
