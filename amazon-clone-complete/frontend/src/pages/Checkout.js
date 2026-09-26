import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Checkout() {
  const [form, setForm] = useState({ shipping_address: '', city: '', state: '', zip: '', coupon_code: '' });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/orders/checkout`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Checkout failed');
    }
  };

  return (
    <div className="page container auth-form">
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout}>
        <input type="text" placeholder="Shipping Address" value={form.shipping_address} onChange={(e) => setForm({...form, shipping_address: e.target.value})} required />
        <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} required />
        <input type="text" placeholder="State" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} required />
        <input type="text" placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} required />
        <input type="text" placeholder="Coupon Code (optional)" value={form.coupon_code} onChange={(e) => setForm({...form, coupon_code: e.target.value})} />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
