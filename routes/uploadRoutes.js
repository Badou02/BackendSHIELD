// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product');
const cloudinary = require('../config/cloudinary');

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route : POST /api/upload/:id
router.post('/:id', upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    // Conversion du buffer en base64
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    // Upload vers Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'shieldbaby/products',
    });

    // Mise à jour du produit avec l'URL de l'image
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { image: uploadResult.secure_url },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({
      message: 'Image uploadée avec succès',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Erreur upload image:', err);
    res.status(500).json({ message: "Erreur lors de l'upload de l’image" });
  }
});

module.exports = router;
