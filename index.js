// server.js
const express = require('express');
const dotenv = require('dotenv');

// --- SỬA LỖI 1: Nạp biến môi trường ĐẦU TIÊN ---
dotenv.config(); 

const connectDB = require('./config/db');

// Bây giờ biến này mới có giá trị để in ra
console.log("MONGO_URI =", process.env.MONGO_URI);

// 1) Kết nối DB
connectDB();

// 2) Init app & middlewares cơ bản
const app = express();
app.use(express.json());

// 3) Preload models (tránh circular dependency)
require('./models/User');
require('./models/Cart');
require('./models/Wishlist');
require('./models/Product');
require('./models/Category');
require('./models/Review');
require('./models/Notification');
require('./models/Order');
// --- SỬA LỖI 2: Thêm Payment vào đây ---
require('./models/Payment'); 

// 4) Import routers
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 5) Mount routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/orders', orderRoutes);

// 6) Healthcheck route (tùy chọn)
app.get('/', (req, res) => {
  res.send('E-Commerce API is running');
});

// 7) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
