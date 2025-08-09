const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewsController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', auth, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/', auth, admin, reviewController.getAllReviews);

module.exports = router;
