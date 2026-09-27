import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">🛒 Amazon Clone</Link>
        <form onSubmit={handleSearch} className="search-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="submit">Search</button>
        </form>
        <div className="navbar-links">
          <Link to="/cart">Cart</Link>
          {token ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
