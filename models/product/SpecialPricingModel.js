import mongoose from "mongoose";

const SpecialPricingSchema = new mongoose.Schema(
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
    specialPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

SpecialPricingSchema.index({ productId: 1 });
SpecialPricingSchema.index({ variantId: 1 });
SpecialPricingSchema.index({ startDate: 1, endDate: 1 });

const SpecialPricing = mongoose.model("SpecialPricing", SpecialPricingSchema);
export default SpecialPricing;
