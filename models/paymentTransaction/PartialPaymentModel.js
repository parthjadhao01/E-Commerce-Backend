import mongoose from "mongoose";

const PartialPaymentSchema = new mongoose.Schema({
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
  totalAmount: {
    type: Number,
    required: true,
  },
  advancePaid: {
    type: Number,
    required: true,
  },
  balanceDue: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
});

const PartialPayment = mongoose.model("PartialPayment", PartialPaymentSchema);
export default PartialPayment;
