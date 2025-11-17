// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    rating:  { type: Number, required: true, min: 1, max: 5 },
    title:   { type: String, trim: true, default: '' },
    comment: { type: String, trim: true, default: '' },
    // optional: ảnh chứng minh, video...
    media:   [{ type: String }]
  },
  { timestamps: true }
);

// Mỗi user chỉ review 1 lần / sản phẩm
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
