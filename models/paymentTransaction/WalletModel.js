import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit", "debit", "refund"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [WalletTransactionSchema],
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
