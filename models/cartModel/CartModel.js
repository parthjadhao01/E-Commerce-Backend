import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for guest users
    },
    sessionId: {
      type: String,
      required: true,
      index: true, // Index for fast guest cart lookup
    },
    items: [CartItemSchema],
    couponCode: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    cartTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Auto-creates createdAt & updatedAt
  }
);

// Indexes for performance
CartSchema.index({ userId: 1 }); // Fast user cart lookup
CartSchema.index({ sessionId: 1 }); // Fast guest cart lookup
CartSchema.index({ userId: 1, sessionId: 1 }); // Compound index

// Method to calculate cart total
CartSchema.methods.calculateTotal = function () {
  const itemsTotal = this.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );
  this.cartTotal = Math.max(0, itemsTotal - this.discount);
  return this.cartTotal;
};

// Method to check if cart is empty
CartSchema.methods.isEmpty = function () {
  return !this.items || this.items.length === 0;
};

// Pre-save hook to auto-calculate total
CartSchema.pre("save", function (next) {
  this.calculateTotal();
  next();
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
