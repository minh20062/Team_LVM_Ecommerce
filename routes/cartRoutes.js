const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const {protect} = require('../middleware/authMiddleware');

router.use(protect);
/**
 * @route   GET api/v1/carts
 * @desc    Lấy giỏ hàng của người dùng đang đăng nhập
 * @access  Private
 */
router.get('/', async (req, res) => {
    try{
        const cart = await Cart.findOne({ user: req.user.id });
        if(!cart){
            return res.status(200).json({
                message: 'Người dùng chưa có giỏ hàng',
                data: {user: req.user.id, items: []},
            });
        }
        res.status(200).json({
            message:'Lấy giỏ hàng thành công',
            data: cart,

        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({message: 'Lỗi máy chủ', error: err.message});
    }
});
/**
 * @route   POST api/v1/carts
 * @desc    Thêm sản phẩm vào giỏ hàng (hoặc cập nhật số lượng)
 * @access  Private
 */
router.post('/', async(req,res) => {
    const { productId, quantity} = req.body;
    try{
        // tim giỏ hàng của user
        let cart = await Cart.findOne({user: req.user.id});
        //nếu user chưa có giỏ hàng sẽ tạo mới
        if(!cart){
            cart = await Cart.create({
                user: req.user.id,
                items:[{product: productId, quantity: quantity}],
            });
        return res.status(201).json({
            message:'Đã tạo giỏ hàng và thêm sản phẩm',
            data: cart,
        });
    }
    const itemIndex = cart.items.findIndex(
        (item) =>item.product.toString()===productId
    );
    if(itemIndex > -1){
        cart.items[itemIndex].quantity = quantity;
    }else{
        cart.items.push({product: productId, quantity: quantity});
    }
    await cart.save();
    res.status(200).json({
        message: 'Cập nhật giỏ hàng thành công',
        data: cart,
    });

}catch(err){
    console.error(err.message);
    res.status(500).json({message:'Lỗi máy chủ',error: err.message});
}
});
module.exports = router;
