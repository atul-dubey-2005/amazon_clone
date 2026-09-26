import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/cart/update/${productId}`,
        { quantity: parseInt(newQuantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  if (loading) return <div className="container loading-spinner">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart.</p>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="cart-container">
          <div className="cart-items">
            <h2>Shopping Cart ({cartItems.length} items)</h2>
            {cartItems.map((item) => {
              const price = item.discount_price || item.price;
              return (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image_url} alt={item.title} />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.title}</h4>
                    <p>₹{price}</p>
                  </div>
                  <div className="cart-item-actions">
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.product_id, e.target.value)}
                    />
                    <span>₹{(price * item.quantity).toFixed(2)}</span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item.product_id)}
                      style={{ padding: '5px 10px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹50</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(totalPrice + 50 + totalPrice * 0.18).toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <Link to="/" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
