// routes/categoryRoutes.js
const express = require('express');
const Category = require('../models/Category');
const { protect /*, admin*/ } = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE
router.post('/', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json(c);
  } catch (err) { next(err); }
});

// LIST
router.get('/', async (req, res, next) => {
  try {
    const items = await Category.find({}).sort('name');
    res.json(items);
  } catch (err) { next(err); }
});

// GET BY ID
router.get('/:id', async (req, res, next) => {
  try {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.json(c);
  } catch (err) { next(err); }
});

// UPDATE
router.patch('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.json(c);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', protect, /*admin,*/ async (req, res, next) => {
  try {
    const c = await Category.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
