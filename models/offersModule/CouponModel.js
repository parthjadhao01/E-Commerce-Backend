import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["flat", "percent"], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number },
  maxDiscount: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  usageLimit: { type: Number },
  usagePerUser: { type: Number },
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  allowedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  allowedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  allowedBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CouponSchema.index({ code: 1 }, { unique: true });

CouponSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
