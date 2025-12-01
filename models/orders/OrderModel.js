import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  items: {
    type: Array,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "cod"],
    required: true,
    default: "pending",
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  billingAddress: {
    type: Object,
    required: true,
  },
  totals: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
    default: "placed",
  },
  couponCode: {
    type: String,
    default: null,
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
