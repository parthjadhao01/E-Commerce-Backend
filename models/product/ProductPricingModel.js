import mongoose from "mongoose";

const ProductPricingSchema = new mongoose.Schema(
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
    basePrice: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["flat", "percent"],
      default: "flat",
    },
    discountValue: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      index: true,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProductPricingSchema.index({ productId: 1 });
ProductPricingSchema.index({ variantId: 1 });
ProductPricingSchema.index({ finalPrice: 1 });

const ProductPricing = mongoose.model("ProductPricing", ProductPricingSchema);
export default ProductPricing;
