import mongoose from "mongoose";

const orderReplacementItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const orderReplacementSchema = new mongoose.Schema(
  {
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
    items: [orderReplacementItemSchema],
    reason: { type: String },
    status: {
      type: String,
      enum: ["requested", "approved", "shipped", "completed", "rejected"],
      default: "requested",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const OrderReplacement = mongoose.model(
  "OrderReplacement",
  orderReplacementSchema
);
export default OrderReplacement;
