// routes/notificationRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

const router = express.Router();

/**
 * GET /api/v1/notifications
 * Lấy danh sách thông báo của user (có thể lọc unread)
 * Query: status=unread | all (default: all)
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;
    const filter = { user: req.user._id };
    if (status === 'unread') filter.read = false;

    const items = await Notification.find(filter).sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
});

/**
 * PATCH /api/v1/notifications
 * Đánh dấu tất cả thông báo của user là đã đọc
 */
router.patch('/', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    res.json({ message: 'Marked all as read' });
  } catch (err) { next(err); }
});

/**
 * PATCH /api/v1/notifications/:id
 * Đánh dấu 1 thông báo là đã đọc
 */
router.patch('/:id', protect, async (req, res, next) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    );
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.json(n);
  } catch (err) { next(err); }
});

module.exports = router;
