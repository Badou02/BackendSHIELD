const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const userController = require('../controllers/userController');

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);

// Admin only
router.get('/', auth, admin, userController.getAllUsers);
router.delete('/:id', auth, admin, userController.deleteUser);
router.put('/:id/role', auth, admin, userController.updateUserRole);

module.exports = router;
