import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './services/Login';
import Products from './services/Products';
import AddProduct from './services/AddProduct';
import './App.css';

const App = () => {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

   // Function to log out, clear the token, and reset the role
   const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div>
        {/* Show logout button if the user is logged in */}
        {role && <button onClick={handleLogout}>Logout</button>}

        <nav className="navigation">
          <Link to="/products">Products</Link><br/>
          {/* Show Add Product link only if the user is an admin */}
          {role === 'admin' && <Link to="/add-product">Add Product</Link>}
        </nav>

        <Routes>
          <Route path="/" element={!role ? <Login onLogin={handleLogin} /> : <Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={role === 'admin' ? <AddProduct /> : <h2>Access Denied</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
