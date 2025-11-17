// routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc   Tạo review cho 1 sản phẩm
 * @route  POST /api/v1/reviews/:productId
 * @access Private (token)
 */
router.post('/:productId', protect, async (req, res, next) => {
  try {
    const { rating, title, comment, media } = req.body;

    // tạo hoặc fail nếu đã có (nhờ unique index)
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      title,
      comment,
      media
    });

    // cập nhật tổng hợp rating/numReviews trên Product
    const agg = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (agg.length) {
      await Product.findByIdAndUpdate(review.product, {
        rating: agg[0].avg,
        numReviews: agg[0].count
      });
    }

    res.status(201).json(review);
  } catch (err) {
    // Duplicate review (unique index) -> 409
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }
    next(err);
  }
});

/**
 * @desc   Lấy danh sách review theo product
 * @route  GET /api/v1/reviews/:productId
 * @access Public
 */
router.get('/:productId', async (req, res, next) => {
  try {
    const items = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
});

module.exports = router;
