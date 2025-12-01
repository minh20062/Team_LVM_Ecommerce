const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

const router = express.Router();

/**
 * @route   GET /api/v1/notifications
 * @desc    Lấy danh sách thông báo của user (có thể lọc unread)
 * @query   status=unread | all (default: all)
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;
    const filter = { user: req.user._id };

    // Nếu query là unread thì lọc thêm điều kiện read=false
    if (status === 'unread') filter.read = false;

    const items = await Notification.find(filter).sort('-createdAt');

    res.status(200).json({
      message: 'Fetched notifications successfully',
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PATCH /api/v1/notifications
 * @desc    Đánh dấu tất cả thông báo của user là đã đọc
 * @access  Private
 */
router.patch('/', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    res.status(200).json({ message: 'Marked all notifications as read' });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PATCH /api/v1/notifications/:id
 * @desc    Đánh dấu 1 thông báo là đã đọc
 * @access  Private
 */
router.patch('/:id', protect, async (req, res, next) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    );

    if (!n) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      data: n,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;