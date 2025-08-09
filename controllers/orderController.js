const Order = require('../models/Order');
const Product = require('../models/product');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, user, totalAmount } = req.body;

    // Vérifier stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.product} introuvable` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }
    }

    // Décrémenter stock
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
    const generateInvoiceNumber = () => {
  return 'INV-' + Date.now();
};


    // Créer la commande
    const newOrder = new Order({ items, user, totalAmount,invoiceNumber: generateInvoiceNumber()});
    await newOrder.save(); 

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Commandes de l'utilisateur connecté
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Liste de toutes les commandes (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getOrderInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name price');

    if (!order) return res.status(404).json({ message: 'Commande non trouvée.' });

    res.json({
      invoiceNumber: order.invoiceNumber,
      customer: order.user,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      date: order.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Get une commande précise
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Changer statut
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// ✅ Supprimer une commande (optionnel)
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};