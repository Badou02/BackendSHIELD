const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }], // <-- tableau d'URL d'images
  category: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'products');
