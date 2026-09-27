import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const handleLogin = (newToken, role) => {
    setToken(newToken);
    setUserRole(role);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Navbar token={token} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/admin" element={token && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
