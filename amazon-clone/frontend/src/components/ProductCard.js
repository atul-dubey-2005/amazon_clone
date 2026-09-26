import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const discount = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image_url} alt={product.title} />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      </div>

      <div className="product-info">
        <h3>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-rating">
          <span className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(product.rating) ? '#ff9900' : '#ddd'}
                size={14}
              />
            ))}
          </span>
          <span className="reviews">({product.reviews})</span>
        </div>

        <div className="product-price">
          {product.discount_price ? (
            <>
              <span className="current-price">₹{product.discount_price}</span>
              <span className="original-price">₹{product.price}</span>
            </>
          ) : (
            <span className="current-price">₹{product.price}</span>
          )}
        </div>

        <div className="product-seller">
          <small>Seller: {product.seller}</small>
        </div>

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
