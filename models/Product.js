// File: models/Product.js (File Tạm Placeholder)
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Đây là file tạm (placeholder) cho Thành viên 2
// Chúng ta chỉ cần định nghĩa 'name' để các 'ref' khác chạy được
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // (Thành viên 2 sẽ thêm price, description, image, v.v... sau)
});

module.exports = mongoose.model('Product', productSchema);