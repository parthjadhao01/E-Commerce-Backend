import mongoose from "mongoose";

const ProductSeoSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

ProductSeoSchema.index({ productId: 1 });
ProductSeoSchema.index({ slug: 1 });

const ProductSeo = mongoose.model("ProductSeo", ProductSeoSchema);
export default ProductSeo;
