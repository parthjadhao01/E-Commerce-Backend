# 🛒 Guest Cart + User Cart System

## Overview

This is a **dual-cart system** that allows both **guest users** (not logged in) and **authenticated users** (logged in) to maintain their shopping cart seamlessly. The system handles cart persistence, cart merging on login, and price snapshots to prevent issues from price changes.

---

## 🎯 Key Features

1. **Guest Cart Support** - Users can shop without logging in (tracked by `sessionId`)
2. **User Cart Persistence** - Logged-in users' carts are saved to their account
3. **Cart Merging** - When guest logs in, their cart merges with existing user cart
4. **Price Snapshots** - Stores price at time of adding (protects from price changes)
5. **Variant Support** - Handles both simple products and products with variants
6. **Coupon Support** - Apply discount codes to cart
7. **Auto Calculations** - Cart total calculated automatically

---

## 📊 Database Schema

### Cart Model

```javascript
carts {
  _id: ObjectId,
  userId: ObjectId | null,        // null = guest cart
  sessionId: String,              // unique session identifier
  items: [{
    productId: ObjectId,          // reference to Product
    variantId: ObjectId | null,   // reference to ProductVariant (if applicable)
    quantity: Number,             // quantity added
    price: Number,                // snapshot of product price when added
    finalPrice: Number,           // price after discounts/offers
    addedAt: Date                 // timestamp when added
  }],
  couponCode: String | null,      // applied coupon code
  discount: Number,               // discount amount from coupon
  cartTotal: Number,              // total cart value (auto-calculated)
  createdAt: Date,                // cart creation timestamp
  updatedAt: Date                 // last update timestamp
}
```

### Indexes (for performance)

```javascript
-{ userId: 1 } - // Fast user cart lookup
  { sessionId: 1 } - // Fast guest cart lookup
  { userId: 1, sessionId: 1 }; // Compound index for merge operations
```

---

## 🔄 How It Works

### 1. Guest User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Guest User Journey                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User visits website (no login)                         │
│     ↓                                                       │
│  2. Frontend generates sessionId (UUID/random string)      │
│     ↓                                                       │
│  3. User adds product to cart                              │
│     ↓                                                       │
│  4. Backend creates cart with:                             │
│     {                                                       │
│       userId: null,                                         │
│       sessionId: "abc123xyz",                              │
│       items: [{ productId, quantity, price, ... }]         │
│     }                                                       │
│     ↓                                                       │
│  5. Cart persists in database                              │
│     ↓                                                       │
│  6. User can continue shopping anytime with same sessionId │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Logged-in User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Logged-in User Journey                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User logs in                                            │
│     ↓                                                       │
│  2. Backend gets userId from authentication                │
│     ↓                                                       │
│  3. User adds product to cart                              │
│     ↓                                                       │
│  4. Backend creates/updates cart with:                     │
│     {                                                       │
│       userId: "user123",                                    │
│       sessionId: "abc123xyz",                              │
│       items: [{ productId, quantity, price, ... }]         │
│     }                                                       │
│     ↓                                                       │
│  5. Cart linked to user account                            │
│     ↓                                                       │
│  6. User can access same cart from any device after login  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Cart Merge Flow (Guest → User)

```
┌─────────────────────────────────────────────────────────────┐
│ Cart Merge on Login                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BEFORE LOGIN:                                              │
│  Guest Cart: { sessionId: "abc123", items: [A, B] }       │
│                                                             │
│  User logs in...                                            │
│                                                             │
│  SYSTEM FINDS:                                              │
│  User Cart:  { userId: "user123", items: [B, C] }         │
│                                                             │
│  MERGE LOGIC:                                               │
│  - Item A (only in guest) → Add to user cart              │
│  - Item B (in both)       → Combine quantities             │
│  - Item C (only in user)  → Keep as is                    │
│                                                             │
│  AFTER MERGE:                                               │
│  User Cart: { userId: "user123", items: [A, B(×2), C] }   │
│  Guest Cart: Deleted ✓                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. Add Item to Cart

**Endpoint:** `POST /api/cart`

**Body:**

```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1", // optional (null for guest)
  "sessionId": "abc123xyz", // required
  "productId": "64a1b2c3d4e5f6g7h8i9j0k2", // required
  "variantId": "64a1b2c3d4e5f6g7h8i9j0k3", // optional
  "quantity": 2 // required (default: 1)
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "_id": "cart_id",
    "userId": null,
    "sessionId": "abc123xyz",
    "items": [
      {
        "productId": {
          "_id": "product_id",
          "title": "Laptop",
          "price": 50000,
          "images": ["image1.jpg"]
        },
        "variantId": null,
        "quantity": 2,
        "price": 50000,
        "finalPrice": 48000,
        "addedAt": "2025-11-05T10:30:00.000Z"
      }
    ],
    "couponCode": null,
    "discount": 0,
    "cartTotal": 96000,
    "createdAt": "2025-11-05T10:30:00.000Z",
    "updatedAt": "2025-11-05T10:30:00.000Z"
  }
}
```

### 2. Get Cart

**Endpoint:** `GET /api/cart?userId=...&sessionId=...`

**Query Params:**

- `userId` (optional): User ID for logged-in users
- `sessionId` (optional): Session ID for guest users
- **Note:** At least one must be provided

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "userId": null,
    "sessionId": "abc123xyz",
    "items": [
      {
        "productId": {
          "_id": "product_id",
          "title": "Laptop",
          "price": 50000,
          "images": ["image1.jpg"],
          "stock": 10
        },
        "variantId": null,
        "quantity": 2,
        "price": 50000,
        "finalPrice": 48000,
        "addedAt": "2025-11-05T10:30:00.000Z"
      }
    ],
    "couponCode": null,
    "discount": 0,
    "cartTotal": 96000
  }
}
```

### 3. Update Item Quantity

**Endpoint:** `PUT /api/cart/update-quantity`

**Body:**

```json
{
  "userId": "user_id", // optional
  "sessionId": "abc123xyz", // required
  "productId": "product_id",
  "variantId": "variant_id", // optional
  "quantity": 5
}
```

### 4. Remove Item from Cart

**Endpoint:** `DELETE /api/cart/item`

**Body:**

```json
{
  "userId": "user_id", // optional
  "sessionId": "abc123xyz", // required
  "productId": "product_id",
  "variantId": "variant_id" // optional
}
```

### 5. Clear Cart

**Endpoint:** `POST /api/cart/clear`

**Body:**

```json
{
  "userId": "user_id", // optional
  "sessionId": "abc123xyz" // required
}
```

### 6. Merge Carts (On Login)

**Endpoint:** `POST /api/cart/merge`

**Body:**

```json
{
  "userId": "user_id", // required
  "sessionId": "abc123xyz" // required (guest sessionId)
}
```

**What happens:**

1. Finds guest cart by sessionId (where userId is null)
2. Finds user cart by userId
3. Merges all items from guest cart to user cart
4. Combines quantities if same item exists in both
5. Deletes guest cart after merge

### 7. Apply Coupon

**Endpoint:** `POST /api/cart/apply-coupon`

**Body:**

```json
{
  "userId": "user_id", // optional
  "sessionId": "abc123xyz", // required
  "couponCode": "SAVE20"
}
```

### 8. Remove Coupon

**Endpoint:** `POST /api/cart/remove-coupon`

**Body:**

```json
{
  "userId": "user_id", // optional
  "sessionId": "abc123xyz" // required
}
```

---

## 💻 Frontend Implementation

### 1. Generate Session ID

```javascript
// utils/sessionManager.js
export const getSessionId = () => {
  let sessionId = localStorage.getItem("cart_session_id");

  if (!sessionId) {
    // Generate unique session ID
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("cart_session_id", sessionId);
  }

  return sessionId;
};

export const getUserId = () => {
  // Get from authentication context/localStorage
  return localStorage.getItem("user_id") || null;
};
```

### 2. Add to Cart

```javascript
// services/cartService.js
import axios from "axios";
import { getSessionId, getUserId } from "../utils/sessionManager";

export const addToCart = async (productId, variantId = null, quantity = 1) => {
  try {
    const response = await axios.post("/api/cart", {
      userId: getUserId(),
      sessionId: getSessionId(),
      productId,
      variantId,
      quantity,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
```

### 3. Get Cart

```javascript
export const getCart = async () => {
  try {
    const params = {
      sessionId: getSessionId(),
      ...(getUserId() && { userId: getUserId() }),
    };

    const response = await axios.get("/api/cart", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
```

### 4. Merge on Login

```javascript
export const mergeCartsOnLogin = async (userId) => {
  try {
    const response = await axios.post("/api/cart/merge", {
      userId,
      sessionId: getSessionId(),
    });

    // Update userId in localStorage
    localStorage.setItem("user_id", userId);

    return response.data;
  } catch (error) {
    console.error("Error merging carts:", error);
    throw error;
  }
};
```

---

## 🎨 React Component Example

```javascript
// components/AddToCartButton.jsx
import React, { useState } from "react";
import { addToCart } from "../services/cartService";
import { toast } from "react-toastify";

const AddToCartButton = ({ product, variant = null }) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      await addToCart(product._id, variant?._id || null, quantity);

      toast.success("Item added to cart!");

      // Optional: Update cart count in header
      // dispatch(updateCartCount());
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-cart">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCartButton;
```

---

## 🔐 Security Considerations

### 1. SessionId Management

```javascript
// Generate secure session ID
import { v4 as uuidv4 } from "uuid";

const sessionId = uuidv4(); // e.g., "550e8400-e29b-41d4-a716-446655440000"
```

### 2. Price Validation (Backend)

```javascript
// Always fetch current price from database, never trust client
const product = await Product.findById(productId);
const currentPrice = variant ? variant.price : product.price;

// Store snapshot price
const itemPrice = currentPrice; // Not from req.body.price!
```

### 3. Stock Validation

```javascript
// Check stock availability before adding
if (variant) {
  if (variant.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: "Insufficient stock",
    });
  }
} else {
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: "Insufficient stock",
    });
  }
}
```

---

## ⚡ Performance Optimizations

### 1. Indexes

Already implemented in model:

- `{ userId: 1 }` - Fast user cart lookup
- `{ sessionId: 1 }` - Fast guest cart lookup

### 2. Populate Only Necessary Fields

```javascript
await cart.populate([
  { path: "items.productId", select: "title name price images stock" },
  { path: "items.variantId", select: "variantName price images stock" },
]);
```

### 3. Batch Operations

Instead of saving cart after each item addition, batch multiple operations:

```javascript
// Bad: Multiple saves
await cart.save(); // After item 1
await cart.save(); // After item 2
await cart.save(); // After item 3

// Good: Single save
cart.items.push(item1);
cart.items.push(item2);
cart.items.push(item3);
await cart.save(); // Once at the end
```

---

## 🧪 Testing Scenarios

### Test Case 1: Guest Cart Creation

```javascript
// 1. Add item without userId
POST /api/cart
{
  "sessionId": "guest123",
  "productId": "prod1",
  "quantity": 1
}

// Expected: Cart created with userId: null
```

### Test Case 2: Guest to User Merge

```javascript
// 1. Guest adds items
POST /api/cart { sessionId: "guest123", productId: "prod1", quantity: 2 }

// 2. User logs in and has existing cart with prod2
// User cart: [prod2]
// Guest cart: [prod1]

// 3. Merge carts
POST /api/cart/merge { userId: "user123", sessionId: "guest123" }

// Expected: User cart: [prod1, prod2]
// Expected: Guest cart deleted
```

### Test Case 3: Duplicate Item Merge

```javascript
// Guest cart: [prodA x2]
// User cart:  [prodA x3]

// After merge:
// User cart:  [prodA x5] ✓
```

---

## 📝 Common Use Cases

### Use Case 1: Shopping as Guest, Then Login

```
1. User browses as guest
2. Adds 3 items to cart (stored with sessionId)
3. Decides to checkout
4. Clicks "Login" button
5. After successful login:
   - Backend merges guest cart with user cart
   - Guest cart deleted
   - User cart contains all items
6. User proceeds to checkout
```

### Use Case 2: Multi-Device Access

```
1. User adds items on Mobile (logged in)
2. Cart stored with userId: "user123"
3. User opens website on Desktop
4. Logs in with same account
5. Backend loads cart by userId: "user123"
6. Same cart items visible on Desktop ✓
```

### Use Case 3: Abandoned Cart Recovery

```
1. Guest adds items to cart
2. Closes browser (sessionId saved in localStorage)
3. Returns after 2 days
4. Opens website again
5. Frontend sends same sessionId
6. Backend loads cart by sessionId
7. All items still in cart ✓
```

---

## 🚀 Next Steps / Enhancements

### 1. Cart Expiry

```javascript
// Add expiry field to schema
expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
}

// Cron job to delete expired carts
```

### 2. Save for Later

```javascript
// Add savedItems array
savedItems: [
  {
    productId: ObjectId,
    variantId: ObjectId,
    savedAt: Date,
  },
];
```

### 3. Stock Validation Before Checkout

```javascript
// Validate all cart items have sufficient stock
export const validateCartStock = async (cartId) => {
  const cart = await Cart.findById(cartId).populate(
    "items.productId items.variantId"
  );

  for (const item of cart.items) {
    const stock = item.variantId ? item.variantId.stock : item.productId.stock;
    if (stock < item.quantity) {
      return {
        valid: false,
        message: `Insufficient stock for ${item.productId.title}`,
      };
    }
  }

  return { valid: true };
};
```

---

## ✅ Summary

The Guest + User Cart system is now **fully functional** with:

✅ **Model**: Complete with indexes, validation, and helper methods  
✅ **Controller**: 8 comprehensive endpoints covering all operations  
✅ **Routes**: All endpoints registered with Swagger documentation  
✅ **Data Integrity**: Product/variant validation before adding  
✅ **Cart Merging**: Smart merge when guest becomes user  
✅ **Price Snapshots**: Protects from price changes  
✅ **Coupon Support**: Apply/remove discount codes  
✅ **Auto Calculations**: Cart total computed automatically

This system is **production-ready** and handles all common e-commerce cart scenarios! 🎉
