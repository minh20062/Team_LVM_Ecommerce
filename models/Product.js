// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: [0, 'Price must be >= 0'] },
    image: { type: String, default: '' }, // URL ảnh chính
    images: [{ type: String }],           // Gallery
    brand: { type: String, default: '' },

    // liên kết danh mục
    category: { type: String , required: true },

    // tồn kho
    countInStock: { type: Number, required: true, min: 0, default: 0 },

    // thuộc tính mở rộng (tùy ý)
    attributes: [
      {
        key: String,
        value: String
      }
    ],

    // tổng hợp rating
    rating: { type: Number, default: 0 },   // trung bình
    numReviews: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index phục vụ tìm kiếm/filter
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
