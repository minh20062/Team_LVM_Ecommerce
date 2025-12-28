const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// ✅ Tạo đơn hàng mới
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Lấy danh sách đơn hàng
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Lấy đơn hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Cập nhật trạng thái đơn hàng
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Xóa đơn hàng theo ID
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;