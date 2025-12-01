import mongoose from "mongoose";

const FlashSaleProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
    flashPrice: { type: Number, required: true },
    stockLimit: { type: Number, required: true },
  },
  { _id: false }
);

const FlashSaleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    products: [FlashSaleProductSchema],
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["scheduled", "running", "expired"],
      default: "scheduled",
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
FlashSaleSchema.index({ status: 1, startDate: 1, endDate: 1 });
FlashSaleSchema.index({ "products.productId": 1 });
FlashSaleSchema.index({ "products.variantId": 1 });

const FlashSale = mongoose.model("FlashSale", FlashSaleSchema);
export default FlashSale;
