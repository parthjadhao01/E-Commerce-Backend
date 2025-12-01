import mongoose from "mongoose";

const ShippingRuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    minOrderValue: {
      type: Number,
      required: [true, "Minimum order value is required"],
      default: 0,
      min: [0, "Minimum order value cannot be negative"],
    },
    maxOrderValue: {
      type: Number,
      required: [true, "Maximum order value is required"],
      default: Number.MAX_SAFE_INTEGER,
      min: [0, "Maximum order value cannot be negative"],
    },
    shippingCost: {
      type: Number,
      required: [true, "Shipping cost is required"],
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      index: true, // Index for fast country-based lookups
    },
    state: {
      type: String,
      default: null,
      trim: true,
      index: true, // Index for fast state-based lookups
    },
    postalCodes: {
      type: [String],
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
      index: true, // Index for filtering active/inactive rules
    },
  },
  {
    timestamps: true, // Auto-creates createdAt & updatedAt
  }
);

// Indexes for performance
ShippingRuleSchema.index({ country: 1, state: 1 }); // Compound index for region-based queries
ShippingRuleSchema.index({ status: 1, minOrderValue: 1, maxOrderValue: 1 }); // For active rules lookup

// Validation: maxOrderValue must be greater than minOrderValue
ShippingRuleSchema.pre("save", function (next) {
  if (this.maxOrderValue <= this.minOrderValue) {
    next(
      new Error("Maximum order value must be greater than minimum order value")
    );
  } else {
    next();
  }
});

const ShippingRule = mongoose.model("ShippingRule", ShippingRuleSchema);
export default ShippingRule;
