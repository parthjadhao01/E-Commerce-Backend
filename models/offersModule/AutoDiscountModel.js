import mongoose from "mongoose";

const AutoDiscountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountType: { type: String, enum: ["flat", "percent"], required: true },
  value: { type: Number, required: true },
  minCartValue: { type: Number },
  applicableTo: {
    type: {
      type: String,
      enum: ["product", "category", "brand", "all"],
      required: true
    },
    ids: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  priority: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
});

const AutoDiscount = mongoose.model("AutoDiscount", AutoDiscountSchema);
export default AutoDiscount;
