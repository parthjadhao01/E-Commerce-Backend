import mongoose from "mongoose";

const CurrencyRateSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

CurrencyRateSchema.index({ from: 1, to: 1 }, { unique: true });

const CurrencyRate = mongoose.model("CurrencyRate", CurrencyRateSchema);
export default CurrencyRate;
