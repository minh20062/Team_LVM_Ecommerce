const express = require('express');
const Category = require('../models/Category');
const { protect /*, admin*/ } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/v1/categories
 * @desc    Tạo mới một category
 * @access  Private (cần token, thường admin)
 */
router.post('/', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json({
      message: 'Category created successfully',
      data: c,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/v1/categories
 * @desc    Lấy danh sách tất cả category
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await Category.find({}).sort('name');
    res.status(200).json({
      message: 'Fetched categories successfully',
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Lấy chi tiết category theo id
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({
      message: 'Fetched category successfully',
      data: c,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PATCH /api/v1/categories/:id
 * @desc    Cập nhật category theo id
 * @access  Private (cần token, thường admin)
 */
router.patch('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({
      message: 'Category updated successfully',
      data: c,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Xóa category theo id
 * @access  Private (cần token, thường admin)
 */
router.delete('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;