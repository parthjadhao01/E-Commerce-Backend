import mongoose from "mongoose";

const TaxRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
  },
  { timestamps: false }
);

TaxRuleSchema.index({ name: 1 });
TaxRuleSchema.index({ country: 1 });
TaxRuleSchema.index({ state: 1 });

const TaxRule = mongoose.model("TaxRule", TaxRuleSchema);
export default TaxRule;
