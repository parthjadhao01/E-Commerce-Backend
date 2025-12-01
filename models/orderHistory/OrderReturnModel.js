import mongoose from "mongoose";

const orderReturnItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  reason: { type: String },
});

const orderReturnSchema = new mongoose.Schema(
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
    items: [orderReturnItemSchema],
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "refunded"],
      default: "requested",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const OrderReturn = mongoose.model("OrderReturn", orderReturnSchema);
export default OrderReturn;
