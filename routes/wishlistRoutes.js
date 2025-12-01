const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

// Middleware bảo vệ: tất cả route trong wishlist đều yêu cầu đăng nhập
router.use(protect);

/**
 * @route   GET /api/v1/wishlists
 * @desc    Lấy wishlist của người dùng đang đăng nhập
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Tìm wishlist theo user id
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      return res.status(200).json({
        message: 'Người dùng chưa có wishlist',
        data: { user: req.user.id, products: [] },
      });
    }

    res.status(200).json({
      message: 'Lấy wishlist thành công',
      data: wishlist,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   POST /api/v1/wishlists
 * @desc    Thêm sản phẩm vào wishlist
 * @access  Private
 */
router.post('/', async (req, res) => {
  const { productId } = req.body;

  // Kiểm tra đầu vào
  if (!productId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp productId' });
  }

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    // Nếu chưa có wishlist thì tạo mới
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
      return res.status(201).json({
        message: 'Đã tạo Wishlist và thêm sản phẩm',
        data: wishlist,
      });
    }

    // Nếu đã có wishlist thì thêm sản phẩm (không trùng nhờ $addToSet)
    await Wishlist.updateOne(
      { user: req.user.id },
      { $addToSet: { products: productId } }
    );

    const updatedWishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.status(200).json({
      message: 'Cập nhật wishlist thành công',
      data: updatedWishlist,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   DELETE /api/v1/wishlists/:productId
 * @desc    Xóa sản phẩm khỏi wishlist
 * @access  Private
 */
router.delete('/:productId', async (req, res) => {
  try {
    await Wishlist.updateOne(
      { user: req.user.id },
      { $pull: { products: req.params.productId } }
    );

    const updatedWishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.status(200).json({
      message: 'Đã xóa sản phẩm khỏi wishlist',
      data: updatedWishlist,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

module.exports = router;