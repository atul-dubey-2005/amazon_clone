import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className="page container">
      <h1>My Profile</h1>
      {profile && (
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>City:</strong> {profile.city}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
