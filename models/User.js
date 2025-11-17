// File: models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Vui lòng đăng nhập tên người dùng'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique:true, //đảo bảo email là duy nhất
            lowercase: true,
            trim:true,
            match:[
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Vui lòng nhập một địa chỉ email hợp lệ',
            ],
        },
        password:{
            type: String,
            required:[true, 'Vui lòng nhập mật khẩu'],
            minlength: [6,"Mật khẩu phải có ít nhất 6 kí tự"],
        },
        role:{
            type:String,
            enum:['user','admin'],
            default: 'user',
        },
    },
    {
        timestamps:true,
    }
);
// Mã hóa mật khẩu TRƯỚC KHI lưu vào DB
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error){
        next(error);
    }
})
// xuất model
const User = mongoose.model('User', userSchema);
module.exports = User;