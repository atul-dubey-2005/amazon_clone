import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories/list`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sort', sortBy);

      const response = await axios.get(`${API_BASE_URL}/products?${params}`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  if (error && products.length === 0) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-content">
          {/* Sidebar Filters */}
          <aside className="sidebar">
            <h3>Filters</h3>

            <div className="filter-section">
              <h4>Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleFilterChange({ minPrice, maxPrice })}
              >
                Apply
              </button>
            </div>

            <div className="filter-section">
              <h4>Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
              >
                <option value="">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="products-header">
              <h1>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p>{products.length} products found</p>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found. Try adjusting your filters.</div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
