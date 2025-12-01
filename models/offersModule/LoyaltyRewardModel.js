import mongoose from "mongoose";

const LoyaltyHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["earn", "redeem"], required: true },
    points: { type: Number, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LoyaltyRewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  points: { type: Number, default: 0 },
  history: [LoyaltyHistorySchema],
  totalEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

LoyaltyRewardSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const LoyaltyReward = mongoose.model("LoyaltyReward", LoyaltyRewardSchema);
export default LoyaltyReward;
