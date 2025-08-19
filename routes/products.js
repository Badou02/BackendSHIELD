// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { upload } = require('../middleware/uploadMiddleware'); // multer
const cloudinary = require('../config/cloudinary'); // config Cloudinary

// ---------------- PUBLIC ---------------- //

// GET all products (optionnel limit)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const products = await Product.find().limit(limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ADMIN ---------------- //

// CREATE product + upload multiple images
router.post(
  '/',
  auth,
  admin,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const { name, price, description, stock, category } = req.body;

      // Upload images vers Cloudinary
      let images = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const base64 = file.buffer.toString('base64');
          const dataUri = `data:${file.mimetype};base64,${base64}`;
          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'shieldbaby/products'
          });
          images.push(uploadResult.secure_url);
        }
      }

      const newProduct = new Product({ name, price, description, stock, category, images });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error('Erreur création produit:', err);
      res.status(400).json({ message: err.message });
    }
  }
);

// UPDATE product + images
router.put(
  '/:id',
  auth,
  admin,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const { name, price, description, stock, category } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

      // Mise à jour des champs
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.stock = stock ?? product.stock;
      product.category = category || product.category;

      // Upload images si fournies
      if (req.files && req.files.length > 0) {
        let images = [];
        for (const file of req.files) {
          const base64 = file.buffer.toString('base64');
          const dataUri = `data:${file.mimetype};base64,${base64}`;
          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'shieldbaby/products'
          });
          images.push(uploadResult.secure_url);
        }
        product.images = images; // remplace les images existantes
      }

      await product.save();
      res.json(product);
    } catch (err) {
      console.error('Erreur mise à jour produit:', err);
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE product
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
