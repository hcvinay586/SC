// File: components/Logout.js
import React from 'react';
import api from '../utils/axiosInstance';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await api.post('/users/logout'); // Server-side route to clear refresh token
      localStorage.removeItem('accessToken'); // Clear the access token from localStorage
      window.location.href = '/login'; // Redirect to login page
    } catch (err) {
      console.error('Error logging out', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
