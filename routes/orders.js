const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Routes utilisateurs
router.get('/mine', auth, orderController.getMyOrders);

// Routes admin
router.get('/', auth, admin, orderController.getAllOrders);
router.get('/:id', auth, admin, orderController.getOrderById);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);
router.delete('/:id', auth, admin, orderController.deleteOrder);

module.exports = router;