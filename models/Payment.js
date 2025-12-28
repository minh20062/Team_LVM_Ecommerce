const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['COD', 'VNPAY', 'MOMO', 'PAYPAL'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);