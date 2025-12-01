import mongoose from "mongoose";

const BuyXGetYSchema = new mongoose.Schema({
  title: { type: String, required: true },
  buy: {
    quantity: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  get: {
    quantity: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    discountType: {
      type: String,
      enum: ["free", "percent", "flat"],
      required: true,
    },
    value: { type: Number }, // Only for percent/flat
  },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const BuyXGetY = mongoose.model("BuyXGetY", BuyXGetYSchema);
export default BuyXGetY;
