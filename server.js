// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1) Load env & connect DB
dotenv.config();
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

// 4) Import routers
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// 5) Mount routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// 6) Healthcheck route (tùy chọn)
app.get('/', (req, res) => {
  res.send('E-Commerce API is running');
});

// 7) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
