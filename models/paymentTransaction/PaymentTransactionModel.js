import mongoose from "mongoose";

const PaymentTransactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["razorpay", "stripe", "paypal", "paytm"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["initiated", "pending", "success", "failed", "refund"],
    required: true,
    default: "initiated",
  },
  responseData: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PaymentTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  PaymentTransactionSchema
);
export default PaymentTransaction;
