const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// GET tous les messages (admin seulement)
router.get('/', auth, admin, messagesController.getMessages);

// POST nouveau message
router.post('/', messagesController.createMessage);

module.exports = router;
