import mongoose from "mongoose";

const VariantAttributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    attributes: {
      type: [VariantAttributeSchema],
      default: [],
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    barcode: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast filtering and SKU enforcement
ProductVariantSchema.index({ sku: 1 }, { unique: true });
ProductVariantSchema.index({ productId: 1 });
ProductVariantSchema.index({ "attributes.name": 1, "attributes.value": 1 });

const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
export default ProductVariant;
