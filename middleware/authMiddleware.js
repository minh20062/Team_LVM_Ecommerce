const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực Token (Bạn đã có cái này)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gán user vào request
      req.user = await User.findById(decoded.user.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- ĐÂY LÀ HÀM CÒN THIẾU CỦA BẠN ---
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Nếu là admin thì cho đi tiếp
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' }); // Chặn lại
  }
};

// Nhớ export cả 2 hàm
module.exports = { protect, admin };