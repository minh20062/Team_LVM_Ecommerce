const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const {protect} = require('../middleware/authMiddleware');
router.use(protect);

/**
 * @route   GET api/v1/wishlists
 * @desc    Lấy wishlist của người dùng đang đăng nhập
 * @access  Private
 */

router.get('/', async(req, res) =>{
    try{
        const wishlist = await Wishlist.findOne({user: req.user.id});

        if(!wishlist){
            return res.status(200).json({
                message: 'Người dùng chưa có wishlist',
                data: {user: req.user.id, products:[]},
            });
        }
        res.status(200).json({
            message:'Lấy wishlist thành công',
            data: wishlist,
        });
    }catch(err){
        console.error(err.message);
        res.status(500).json({message: 'Lỗi máy chủ', error:err.message});
    }
});
/**
 * @route   POST api/v1/wishlists
 * @desc    Thêm sản phẩm vào wishlist
 * @access  Private
 */
router.post('/',async (req,res) =>{
    const{productId} = req.body;
    if(!productId){
        return res.status(400).json({message: 'Vui lòng cung cấp productId'});
    }
    try{
        let wishlist = await Wishlist.findOne({user: req.user.id});
        if(!wishlist){
            wishlist = await Wishlist.create({
                user: req.user.id,
                products:[productId],
            });
            return res.status(201).json({
                message: 'Đã tạo Wishlist và thêm sản phẩm',
                data: wishlist,
            });
        }
        await Wishlist.updateOne(
            {user: req.user.id},
            {$addToSet: {products: productId}}
        );
        const updatedWishlist = await Wishlist.findOne({user: req.user.id});
        res.status(200).json({
            message:'Cập nhật wishlist thành công',
            data:updatedWishlist,
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({message: 'Lỗi máy chủ', error: errr.message});
    }
});
module.exports = router;