import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import './AddProduct.css';
import { Button, Modal } from 'react-bootstrap';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert price to a number
      const numericPrice = parseFloat(price);

      // Check if conversion is successful
      if (isNaN(numericPrice)) {
        setMessage('Price must be a valid number.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/products', {
        name,
        description,
        price: numericPrice,
      }, {
        withCredentials: true, // Optional if you're using an axios instance that has withCredentials set to true
      });

      // Notify parent component about the new product
      onProductAdded(response.data);
      alert('Product added successfully');

      // Reset the input fields
      setName('');
      setPrice('');
      setDescription('');
      setMessage(''); // Clear any previous messages
      setShowModal(false); // Close the modal
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Error adding product');
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Product</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button type="submit">Add Product</button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddProduct;
