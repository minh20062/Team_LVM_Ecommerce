const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// Middleware bảo vệ: tất cả route trong cart đều yêu cầu đăng nhập
router.use(protect);

/**
 * @route   GET /api/v1/carts
 * @desc    Lấy giỏ hàng của người dùng đang đăng nhập
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        message: 'Người dùng chưa có giỏ hàng',
        data: { user: req.user.id, items: [] },
      });
    }

    res.status(200).json({
      message: 'Lấy giỏ hàng thành công',
      data: cart,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   POST /api/v1/carts
 * @desc    Thêm sản phẩm vào giỏ hàng (hoặc cập nhật số lượng)
 * @access  Private
 */
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Vui lòng cung cấp productId và quantity' });
  }

  try {
    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: req.user.id });

    // Nếu user chưa có giỏ hàng thì tạo mới
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
      return res.status(201).json({
        message: 'Đã tạo giỏ hàng và thêm sản phẩm',
        data: cart,
      });
    }

    // Nếu đã có giỏ hàng thì kiểm tra sản phẩm
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Nếu sản phẩm đã có thì cập nhật số lượng
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Nếu chưa có thì thêm mới
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      message: 'Cập nhật giỏ hàng thành công',
      data: cart,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   DELETE /api/v1/carts
 * @desc    Xóa toàn bộ giỏ hàng của user (reset về rỗng)
 * @access  Private
 */
router.delete('/', async (req, res) => {
  try {
    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Xóa toàn bộ items
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Đã xóa toàn bộ giỏ hàng',
      data: cart,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});


module.exports = router;