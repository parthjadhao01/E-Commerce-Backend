import mongoose from "mongoose";

const ComboItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const ComboOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    items: {
      type: [ComboItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length >= 2;
        },
        message: "Combo must have at least 2 products",
      },
    },
    comboPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    startDate: { type: Date, index: true },
    endDate: { type: Date, index: true },
  },
  { timestamps: true }
);

// Indexes for better query performance
ComboOfferSchema.index({ status: 1, startDate: 1, endDate: 1 });
ComboOfferSchema.index({ "items.productId": 1 });

const ComboOffer = mongoose.model("ComboOffer", ComboOfferSchema);
export default ComboOffer;
