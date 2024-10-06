import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please log in again.');
        return;
      }

      // Convert price to a number
      const numericPrice = parseFloat(price);
      
      // Check if conversion is successful
      if (isNaN(numericPrice)) {
        setMessage('Price must be a valid number.');
        return;
      }
      const response = await axios.post('http://localhost:5000/api/products', {
        "name": name,
        "description": description,
        "price": numericPrice 
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      alert('Product added successfully');
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Error adding product');
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
