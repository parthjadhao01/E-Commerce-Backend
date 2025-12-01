import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: { type: String, required: true },
    comment: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin/staff
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
export default OrderHistory;
