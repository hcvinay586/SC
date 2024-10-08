import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import './Products.css';
import { Button, Modal } from 'react-bootstrap';
import AddProduct from './AddProduct';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', description: '', id: null });
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(''); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          withCredentials: true // This is optional if you're using an axios instance that has withCredentials set to true
        });
        setProducts(response.data);
        const role = localStorage.getItem('role');
        if (role) {
          setUserRole(role); // Assuming the role is stored in the user object
        }
      } catch (err) {
        // Handle error, e.g., show a message or log it
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentProduct({ name: product.name, price: product.price, description: product.description, id: product._id });
  };

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this product: "${product.name}"?`);
    if (!confirmDelete) return; 
    try {
      await axios.delete(`http://localhost:5000/api/products/${product._id}`, { withCredentials: true });
      setProducts(products.filter(item => item._id !== product._id));
      setMessage('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage('Error deleting product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/products/${currentProduct.id}`, {
          name: currentProduct.name,
          description: currentProduct.description,
          price: parseFloat(currentProduct.price), // Convert price to a number
        }, { withCredentials: true });

        // Update the product in the local state
        setProducts(products.map(product => (product._id === currentProduct.id ? { ...product, ...currentProduct } : product)));
        setMessage('Product updated successfully');
      } else {
        // Add new product logic if needed
      }

      // Reset form and edit mode
      setCurrentProduct({ name: '', price: '', description: '', id: null });
      setEditMode(false);

    } catch (err) {
      console.error('Error updating product:', err);
      setMessage('Error updating product');
    }
  };

  const resetForm = () => {
    setCurrentProduct({ name: '', price: '', description: '', id: null });
    setEditMode(false);
    setMessage('');
  };

  // Add this function in your Products component
  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]); // Update the products state with the new product
  };

// Include AddProduct in the render
<AddProduct onProductAdded={handleProductAdded} />

  return (
    <div className="products-container">
      <h2>Products</h2>
      {userRole === 'admin' && <AddProduct onProductAdded={handleProductAdded} />}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            {userRole === 'admin' && (
              <>
                <Button variant="warning" onClick={() => handleEdit(product)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(product)}>Delete</Button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      <Modal show={editMode} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={currentProduct.name}
              onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={currentProduct.price}
              onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={currentProduct.description}
              onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button type="submit">{editMode ? 'Update Product' : 'Add Product'}</button>
              <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
