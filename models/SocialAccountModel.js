import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["google", "facebook", "apple"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    providerData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

socialAccountSchema.index({ userId: 1 });
socialAccountSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const SocialAccount = mongoose.model("SocialAccount", socialAccountSchema);

export default SocialAccount;
