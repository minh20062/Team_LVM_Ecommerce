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

    // Tạo review mới (unique index trên {product, user} sẽ ngăn trùng lặp)
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      title,
      comment,
      media
    });

    // Sau khi tạo review, cập nhật lại rating trung bình và số lượng review của Product
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

    res.status(201).json({
      message: 'Review created successfully',
      data: review
    });
  } catch (err) {
    // Nếu user đã review sản phẩm này (duplicate key error từ unique index)
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
      .populate('user', 'name email') // lấy thông tin cơ bản của user
      .sort('-createdAt');            // sắp xếp mới nhất trước

    res.status(200).json({
      message: 'Fetched reviews successfully',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;