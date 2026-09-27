import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Pages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams, filters]);

  const fetchProducts = async () => {
    try {
      const search = searchParams.get('search') || '';
      const url = new URL(`${API_URL}/products`);
      if (search) url.searchParams.append('search', search);
      if (filters.category) url.searchParams.append('category', filters.category);
      if (filters.minPrice) url.searchParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) url.searchParams.append('maxPrice', filters.maxPrice);

      const response = await axios.get(url);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/category/list`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="page container">
      <h1>Browse Products</h1>
      
      <div className="filters">
        <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
        <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
        <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
              <button>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
