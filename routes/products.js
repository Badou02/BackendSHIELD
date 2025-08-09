const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const Product = require('../models/product');  

const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Public routes
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 = aucun filtre
    const products = await Product.find().limit(limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/:id', productController.getProductById);


// Admin only
router.post('/', auth, admin, productController.createProduct);
router.put('/:id', auth, admin, productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;
