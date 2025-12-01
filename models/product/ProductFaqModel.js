import mongoose from "mongoose";

const ProductFaqSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ProductFaqSchema.index({ productId: 1 });

const ProductFaq = mongoose.model("ProductFaq", ProductFaqSchema);
export default ProductFaq;
