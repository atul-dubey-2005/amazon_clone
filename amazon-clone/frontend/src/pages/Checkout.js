import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipcode: '',
    shippingCountry: '',
    paymentMethod: 'credit_card',
    cardNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/orders/checkout`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order placed successfully!\nOrder ID: ${response.data.orderId}\nTransaction ID: ${response.data.transactionId}`);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="container loading-spinner">Loading...</div>;

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + price * item.quantity;
  }, 0);
  const tax = totalPrice * 0.18;
  const finalTotal = totalPrice + 50 + tax;

  return (
    <div className="checkout-page">
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="checkout-container">
          <div className="checkout-form">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
              <h3>Shipping Address</h3>
              <div className="form-row full">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zipcode</label>
                  <input
                    type="text"
                    name="shippingZipcode"
                    value={formData.shippingZipcode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h3>Payment Method</h3>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="net_banking">Net Banking</option>
                </select>
              </div>

              <div className="form-group">
                <label>Card Number (Mock - Enter any 16 digits)</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234567890123456"
                  maxLength="16"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={processing}>
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Review</h3>
            <div className="summary-items">
              {cartItems.map((item) => {
                const price = item.discount_price || item.price;
                return (
                  <div key={item.product_id} className="summary-item">
                    <span>{item.title} x {item.quantity}</span>
                    <span>₹{(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹50</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
