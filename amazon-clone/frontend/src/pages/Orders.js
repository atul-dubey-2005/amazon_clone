import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container loading-spinner">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 0' }}>
      <h1>My Orders</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>₹{order.total_amount.toFixed(2)}</td>
              <td>
                <span style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: order.status === 'delivered' ? '#d4edda' : '#fff3cd',
                  color: order.status === 'delivered' ? '#155724' : '#856404'
                }}>
                  {order.status.toUpperCase()}
                </span>
              </td>
              <td>
                <span style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: order.payment_status === 'completed' ? '#d4edda' : '#f8d7da',
                  color: order.payment_status === 'completed' ? '#155724' : '#721c24'
                }}>
                  {order.payment_status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
