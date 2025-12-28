// routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { protect /*, admin*/ } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc   Create product
 * @route  POST /api/v1/products
 * @access Private (require token) - thường dành cho admin
 */
router.post('/', protect, /*admin,*/ async (req, res, next) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) { next(err); }
});

/**
 * @desc   Get products (list) + filter/sort/paginate
 * @route  GET /api/v1/products
 * @access Public
 * Query: keyword, category, minPrice, maxPrice, sort, page, limit
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      keyword = '',
      category,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const filter = { isActive: true };
    if (keyword) filter.$text = { $search: keyword };
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug')
        .sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (err) { next(err); }
});

/**
 * @desc   Get product by id
 * @route  GET /api/v1/products/:id
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
});

/**
 * @desc   Update product
 * @route  PATCH /api/v1/products/:id
 * @access Private (token) - thường admin
 */
router.patch('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
});

/**
 * @desc   Delete product
 * @route  DELETE /api/v1/products/:id
 * @access Private (token) - thường admin
 */
router.delete('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
