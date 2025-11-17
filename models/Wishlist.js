const mongoose = require('mongoose');
const{Schema} = mongoose;
const WishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true,
            unique: true,
        },
        products:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Wishlist', WishlistSchema);