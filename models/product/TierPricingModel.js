import mongoose from "mongoose";

const TierPricingSchema = new mongoose.Schema(
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
    minQty: {
      type: Number,
      required: true,
      index: true,
    },
    maxQty: {
      type: Number,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: false }
);

TierPricingSchema.index({ productId: 1 });
TierPricingSchema.index({ variantId: 1 });
TierPricingSchema.index({ minQty: 1, maxQty: 1 });

const TierPricing = mongoose.model("TierPricing", TierPricingSchema);
export default TierPricing;
