// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product');
const cloudinary = require('../config/cloudinary');

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route : POST /api/upload/:id (multi-images)
router.post('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    const uploadResults = [];

    for (const file of req.files) {
      const base64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      // Upload vers Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'shieldbaby/products',
      });

      uploadResults.push(uploadResult.secure_url);
    }

    // Mise à jour du produit avec les nouvelles images
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: { $each: uploadResults } } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({
      message: 'Images uploadées avec succès',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Erreur upload image:', err);
    res.status(500).json({ message: "Erreur lors de l'upload des images" });
  }
});

module.exports = router;
