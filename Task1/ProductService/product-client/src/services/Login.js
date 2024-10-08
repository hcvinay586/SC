import React, { useState } from 'react';
import api from '../utils/axiosInstance';
import './Login.css';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('http://localhost:5000/api/users/login', { username: userId, password: password });
      const { accessToken, role } = response.data;
      localStorage.setItem('accessToken', accessToken); // Store the access token
      localStorage.setItem('role', role);
      localStorage.setItem('user', userId);
      onLogin(role, userId);
    } catch (err) {
      if (err.response) {
        // Handle error based on status
        const { status } = err.response; // Destructure status from response
        console.error('Error status:', status);
        setError('Invalid credentials'); // Generic error message
        if (status === 401) {
          // Handle unauthorized error specifically
          setError('Unauthorized. Please check your credentials.');
        }
      } else {
        console.error('Network error:', err.message);
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
