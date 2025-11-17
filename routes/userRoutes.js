const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import model User ta vừa tạo
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); //import JWT
const {protect} = require('../middleware/authMiddleware');
/**
 * @route   POST api/v1/users
 * @desc    Đăng ký người dùng mới (Register User)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // 1. Lấy username, email, password từ body của request
    const { username, email, password } = req.body;

    // 2. Kiểm tra xem email đã tồn tại chưa
    let user = await User.findOne({ email: email });
    if (user) {
      // Nếu user đã tồn tại, trả về lỗi 400
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // 3. Tạo một đối tượng User mới
    // (Chúng ta KHÔNG cần hash password ở đây)
    user = new User({
      username,
      email,
      password, // Cứ truyền password thô (plain text) vào đây
    });

    // 4. LƯU user vào database
    // -> Khi gọi .save(), hook 'pre-save' trong User.js sẽ tự động chạy
    // -> Và mã hóa mật khẩu trước khi lưu.
    await user.save();

    // 5. Trả về thông tin (NHƯNG KHÔNG bao giờ trả về mật khẩu)
    res.status(201).json({
      message: 'Người dùng đăng ký thành công!',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Bắt lỗi (ví dụ: lỗi validation từ Schema)
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});

/**
 * @route   POST api/v1/users/login
 * @desc    Đăng nhập người dùng (Login User) & Cấp JWT
 * @access  Public
 */

router.post('/login', async(req, res) => {
    try{
        //1 lấy email và password từ body
        const{ email,password} = req.body;
        //2 kiemer tra xem email có tồn tại không?
        const user =await User.findOne({email: email});
        if(!user){
            //neu khong co user loi 400
            return res.status(400).json({message: 'Email hoặc mật khẩu không đúng'});
        }
        //3 so sanh mật khẩu
        //dùng bcrypt.compare để só sánh pasword thô từ req.body
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            // nếu kh khớp
            return res.status(400).json({message: 'Email hoặc mật khẩu không đúng'})
        }
        //4 mật khẩu khớp! tạo JWT token
        const payload = {
            user:{
                id: user._id,
                role: user.role,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET, //Lay secret tu file .env
            {expiresIn: '3h'}, //token sẽ hết hạn trong 3H
            (err,token) =>{
                if(err) throw err;
                // 5. tra token về cho client
                res.status(200).json({
                    message: 'Đăng nhập thành công',
                    token: token,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        )
    } catch(err){
    console.error(err.message);
     res.status(500).json({message: 'Lỗi máy chủ', error: err.message});
}
});

/**
 * @route   GET api/v1/users/me
 * @desc    Lấy thông tin người dùng đang đăng nhập (Get my profile)
 * @access  Private (Cần Token)
 */
router.get('/me',protect, async(req,res)=>{
    try{
        res.status(200).json({
            message:"Lấy thông tin cá nhân thành công",
            data: req.user
        });
    }catch(error){
        res.status(500).json({message:'Lỗi máy chủ', error: error.message});
    }
});

// Xuất router này ra để server.js có thể dùng
module.exports = router;