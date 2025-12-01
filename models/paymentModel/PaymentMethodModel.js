import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["COD", "Razorpay", "Stripe", "PayPal"],
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  config: {
    type: Object,
    default: {},
  },
});

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
export default PaymentMethod;
