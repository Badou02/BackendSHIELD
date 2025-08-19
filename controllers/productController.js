const Product = require('../models/product');

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    // ✅ Récupérer toutes les images uploadées
    const images = req.files ? req.files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`) : [];

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      category,
      image: images
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    // ✅ Si nouvelles images envoyées, on remplace
    if (req.files && req.files.length > 0) {
      product.image = req.files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};