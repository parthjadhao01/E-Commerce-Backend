import mongoose from "mongoose";

const StockLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["in", "out"],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["manual", "order", "return"],
      required: true,
      index: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

StockLogSchema.index({ productId: 1 });
StockLogSchema.index({ variantId: 1 });
StockLogSchema.index({ type: 1 });
StockLogSchema.index({ source: 1 });

const StockLog = mongoose.model("StockLog", StockLogSchema);
export default StockLog;
