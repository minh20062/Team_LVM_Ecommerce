const mongoose = require('mongoose');
const {Schema} = mongoose;
//1 Schema cho tung mặt hàng trong giỏ
const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min:[1,'Số lượng ít nhất là 1'],
        default:1,
    },

},{_id:false});
//Schema của giỏ hàng chính
const CartSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required: true,
            unique: true, // moỗi user chỉ có 1 giỏ hàng
    },
        items:[CartItemSchema],
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Cart', CartSchema);