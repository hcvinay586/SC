import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './services/Login';
import Logout from './services/Logout';
import Products from './services/Products';
import AddProduct from './services/AddProduct';
import axios from './utils/axiosInstance';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Function to decode JWT token
const decodeToken = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000; // Convert to milliseconds
};

const App = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const handleLogin = (userRole, userName) => {
    setRole(userRole);
    setUser(userName)
    setIsAuthenticated(true);
    navigate('/products');
  };

  const handleLogout = useCallback(() => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    axios.post('/users/logout'); // Clear refresh token in backend
    navigate('/login'); // Redirect to login page after logout
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios
        .get('/users/validate-token')
        .then(() => {
          const role = localStorage.getItem('role');
          setRole(role);
          setIsAuthenticated(true);
        })
        .catch(() => {
          handleLogout(); // Log out on error
        })
        .finally(() => {
          setLoading(false); // Set loading to false after validation
        });
    } else {
      setLoading(false); // If no token, stop loading
    }
  }, [handleLogout]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const expirationTime = decodeToken(token);
        if (Date.now() >= expirationTime) {
          handleLogout(); // Call logout if token is expired
        }
      }
    };

    // Check every minute (60000 ms)
    const interval = setInterval(checkTokenExpiration, 60000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [handleLogout]);

  if (loading) {
    return <div>Loading...</div>; // Loading state UI
  }
  

  return (
    <div>
      {isAuthenticated && (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <p><b>{user}</b>(Role: {role})</p> {/* Display user role here */}
        </div>
      )}

      <nav className="navigation">
        <br/><br/>
        {((role === 'admin') || (role === 'manager')) && (
          <Link to="/products">Products</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={!role ? <Login onLogin={handleLogin} /> : <Products />} />
        <Route 
          path="/products" 
          element={((role === 'admin') || (role === 'manager')) ? <Products /> : <h2>Access Denied</h2>} 
        />
        <Route 
          path="/add-product" 
          element={role === 'admin' ? <AddProduct /> : <h2>Access Denied</h2>} 
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default App;
