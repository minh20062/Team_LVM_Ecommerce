const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();
console.log("✅ paymentRoutes loaded");

// Tạo thanh toán mới
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy thông tin thanh toán theo ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user')
      .populate('order');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Lấy tất cả thanh toán
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user')
      .populate('order');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật trạng thái thanh toán
router.put('/:id/status', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, transactionId: req.body.transactionId },
      { new: true }
    );

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Xóa thanh toán theo ID
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;