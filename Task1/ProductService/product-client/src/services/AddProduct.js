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
      const role = localStorage.getItem('role');
      const response = await axios.post('http://localhost:5000/api/products', {
        "name": name,
        "description": description,
        "price": price
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessage('Product added successfully');
    } catch (err) {
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
