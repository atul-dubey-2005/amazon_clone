import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `${API_BASE_URL}/cart/add`,
        { product_id: parseInt(id), quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg('Added to cart!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="container loading-spinner">Loading product...</div>;
  if (!product) return <div className="container error-message">{error}</div>;

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-details-container">
          <div className="product-image-section">
            <img src={product.image_url} alt={product.title} />
          </div>

          <div className="product-details-section">
            <h1>{product.title}</h1>

            <div className="product-rating-section">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(product.rating) ? '#ff9900' : '#ddd'}
                    size={18}
                  />
                ))}
              </div>
              <span className="rating-info">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="price-section">
              {product.discount_price ? (
                <>
                  <span className="current-price">₹{product.discount_price}</span>
                  <span className="original-price">₹{product.price}</span>
                  <div style={{ marginTop: '10px', color: '#28a745', fontWeight: 'bold' }}>
                    {discount}% OFF
                  </div>
                </>
              ) : (
                <span className="current-price">₹{product.price}</span>
              )}
            </div>

            <div className={`stock-info ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>{product.description}</p>

            {product.stock > 0 && (
              <>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(e.target.value, product.stock))}
                  />
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                <div className="action-buttons">
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/cart')}>
                    Go to Cart
                  </button>
                </div>
              </>
            )}

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <p><strong>Seller:</strong> {product.seller}</p>
              <p><strong>Category:</strong> {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
