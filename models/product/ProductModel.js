import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],
    type: {
      type: String,
      enum: ["simple", "variable"],
      default: "simple",
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

// Text index for search optimization
ProductSchema.index({ title: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ categoryIds: 1 });
ProductSchema.index({ sku: 1 });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
