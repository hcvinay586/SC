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

module.exports = { getProducts, addProduct, getProduct };
