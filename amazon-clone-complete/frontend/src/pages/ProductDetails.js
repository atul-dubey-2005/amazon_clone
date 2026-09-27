import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Pages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const addToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`${API_URL}/cart`, { product_id: id, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to cart!');
      navigate('/cart');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  return (
    <div className="page container">
      {product ? (
        <div className="product-details">
          <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
          <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h2>₹{product.price}</h2>
            <p>Stock: {product.stock}</p>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
            <button onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProductDetails;
