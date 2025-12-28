const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['order_update', 'product_alert', 'system_message', 'review_reply'], // Loại thông báo
      default: 'system_message',
    },
    isRead: {
      type: Boolean,
      default: false, // Trạng thái Đã đọc hay chưa đọc
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);