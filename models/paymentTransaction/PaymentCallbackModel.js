import mongoose from "mongoose";

const PaymentCallbackSchema = new mongoose.Schema({
  gateway: {
    type: String,
    required: true,
  },
  rawRequest: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentCallback = mongoose.model("PaymentCallback", PaymentCallbackSchema);
export default PaymentCallback;
