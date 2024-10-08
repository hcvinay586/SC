const express = require('express');
const router = express.Router();
const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Only admin can add products
router.post('/products', protect, authorizeRoles('admin'), addProduct);

// Both admin and manager can get all products
router.get('/products', protect, authorizeRoles('admin', 'manager'), getProducts);

// Both admin and manager can get a specific product by ID
router.get('/product/:id', protect, authorizeRoles('admin', 'manager'), getProduct);

// Only admin can edit or delete products
router.put('/products/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/products/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;
