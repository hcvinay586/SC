const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Get all products (admin and manager)
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Add a new product (admin only)
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price } = req.body;

    // Validate input
    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'Please provide name, description, and price' });
    }
  
    const product = new Product({
      name,
      description,
      price,
    });
  
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Get a single product by ID (admin and manager)
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
  
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
});

//@desc Function to update a product (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get product ID from the URL
  const { name, description, price } = req.body;

  // Validate input
  if (!name && !description && price === undefined) {
    return res.status(400).json({ message: 'Please provide at least one field to update' });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, { name, description, price }, { new: true, runValidators: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product' });
  }
});

//@desc Function to delete a product(admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get product ID from the URL

  try {
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product' });
  }
});

module.exports = { getProducts, addProduct, getProduct, updateProduct, deleteProduct };
