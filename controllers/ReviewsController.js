const Review = require('../models/Reviews');

exports.createReview = async (req, res) => {
  try {
    const { product, message, rating } = req.body;
    const user = req.user._id;

    const review = new Review({ product, user, message, rating });
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product').populate('user', 'name email');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
