const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); 
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST api/v1/users/register
 * @desc    Đăng ký người dùng mới
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    user = new User({ username, email, password });
    await user.save();

    // Tạo payload
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    // Tạo token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'Người dùng đăng ký thành công!',
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   POST api/v1/users/login
 * @desc    Đăng nhập & Trả về Token (ĐÃ SỬA)
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // --- PHẦN SỬA QUAN TRỌNG: TẠO TOKEN ---
    
    // 3. Tạo Payload
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    // 4. Ký và trả về Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        
        // Trả về Token cho Client
        res.status(200).json({
          message: 'Đăng nhập thành công',
          token, // <--- BẮT BUỘC PHẢI CÓ
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
    // --- HẾT PHẦN SỬA ---

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   GET api/v1/users/me
 * @desc    Lấy thông tin người dùng đang đăng nhập
 * @access  Private (Cần Token)
 */
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      message: "Lấy thông tin cá nhân thành công",
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

module.exports = router;