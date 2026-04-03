const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/product');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }

    const uploadResults = []; // ✅ Bug 1 corrigé : tableau manquant

    for (const file of req.files) { // ✅ Bug 2 corrigé : boucle manquante
      const base64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64}`; // ✅ Bug 3 corrigé : dataUri non défini

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'shieldbaby/products',
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" }
        ],
        eager: [
          { width: 400, height: 400, crop: "fill", quality: "auto", fetch_format: "auto" },
          { width: 800, crop: "limit", quality: "auto", fetch_format: "auto" }
        ],
        eager_async: true
      });

      uploadResults.push(uploadResult.secure_url); // ✅ On push l'URL dans le tableau
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: { $each: uploadResults } } }, // ✅ uploadResults (tableau)
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