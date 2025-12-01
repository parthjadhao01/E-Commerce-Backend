import mongoose from "mongoose";

const GalleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const ProductGallerySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    images: {
      type: [GalleryImageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

ProductGallerySchema.index({ productId: 1 });

const ProductGallery = mongoose.model("ProductGallery", ProductGallerySchema);
export default ProductGallery;
