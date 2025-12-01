import Cart from "../models/cartModel/CartModel.js";
import Product from "../models/product/ProductModel.js";
import ProductVariant from "../models/product/ProductVariantModel.js";

// ==================== ADD TO CART ====================
// Adds item to cart (creates new cart if doesn't exist)
// Supports both guest (sessionId) and logged-in users (userId)
export const addToCart = async (req, res) => {
  try {
    const { userId, sessionId, productId, variantId, quantity = 1 } = req.body;

    // Validation
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify variant if provided
    let variant = null;
    if (variantId) {
      variant = await ProductVariant.findById(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Product variant not found",
        });
      }
      // Verify variant belongs to product
      if (!variant.productId.equals(productId)) {
        return res.status(400).json({
          success: false,
          message: "Variant does not belong to this product",
        });
      }
    }

    // Get price (variant price takes precedence)
    const itemPrice = variant ? variant.price : product.price;
    const itemFinalPrice = itemPrice; // TODO: Apply discounts/offers here

    // Find or create cart
    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: userId || null,
        sessionId,
        items: [],
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.equals(productId) &&
        (variantId
          ? item.variantId && item.variantId.equals(variantId)
          : !item.variantId)
    );

    if (itemIndex > -1) {
      // Update existing item
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = itemPrice;
      cart.items[itemIndex].finalPrice = itemFinalPrice;
      cart.items[itemIndex].addedAt = new Date();
    } else {
      // Add new item
      cart.items.push({
        productId,
        variantId: variantId || null,
        quantity,
        price: itemPrice,
        finalPrice: itemFinalPrice,
      });
    }

    // Save cart (total calculated automatically by pre-save hook)
    await cart.save();

    // Populate product details for response
    await cart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET CART ====================
// Retrieves cart for user or guest
export const getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: "userId or sessionId required",
      });
    }

    // Build query: prefer userId if provided
    const query = userId ? { userId } : { sessionId, userId: null };

    let cart = await Cart.findOne(query).populate([
      { path: "items.productId", select: "title name price images stock" },
      { path: "items.variantId", select: "variantName price images stock" },
    ]);

    // If no cart found, return empty cart structure
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          userId: userId || null,
          sessionId: sessionId,
          items: [],
          couponCode: null,
          discount: 0,
          cartTotal: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE ITEM QUANTITY ====================
// Updates quantity of a specific item in cart
export const updateItemQuantity = async (req, res) => {
  try {
    const { userId, sessionId, productId, variantId, quantity } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.equals(productId) &&
        (variantId
          ? item.variantId && item.variantId.equals(variantId)
          : !item.variantId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].addedAt = new Date();

    await cart.save();

    await cart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== REMOVE FROM CART ====================
// Removes a specific item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, sessionId, productId, variantId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.equals(productId) &&
          (variantId
            ? item.variantId && item.variantId.equals(variantId)
            : !item.variantId)
        )
    );

    await cart.save();

    await cart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CLEAR CART ====================
// Removes all items from cart
export const clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;
    cart.cartTotal = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== MERGE CARTS ====================
// Merges guest cart with user cart when user logs in
export const mergeCarts = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and sessionId are required",
      });
    }

    // Find guest cart
    const guestCart = await Cart.findOne({ sessionId, userId: null });

    // Find user cart
    let userCart = await Cart.findOne({ userId });

    // If no guest cart, return user cart or create empty one
    if (!guestCart || guestCart.items.length === 0) {
      if (!userCart) {
        userCart = new Cart({
          userId,
          sessionId,
          items: [],
        });
        await userCart.save();
      }

      await userCart.populate([
        { path: "items.productId", select: "title name price images" },
        { path: "items.variantId", select: "variantName price images" },
      ]);

      return res.status(200).json({
        success: true,
        message: "No guest cart to merge",
        data: userCart,
      });
    }

    // Create user cart if doesn't exist
    if (!userCart) {
      userCart = new Cart({
        userId,
        sessionId,
        items: [],
      });
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        (item) =>
          item.productId.equals(guestItem.productId) &&
          (guestItem.variantId
            ? item.variantId && item.variantId.equals(guestItem.variantId)
            : !item.variantId)
      );

      if (existingItemIndex > -1) {
        // Item exists, add quantities
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
        userCart.items[existingItemIndex].addedAt = new Date();
      } else {
        // Add new item
        userCart.items.push(guestItem);
      }
    }

    // Save merged cart
    await userCart.save();

    // Delete guest cart
    await Cart.deleteOne({ _id: guestCart._id });

    await userCart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Carts merged successfully",
      data: userCart,
    });
  } catch (error) {
    console.error("Error merging carts:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== APPLY COUPON ====================
// Applies a coupon code to the cart
export const applyCoupon = async (req, res) => {
  try {
    const { userId, sessionId, couponCode } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot apply coupon to empty cart",
      });
    }

    // TODO: Validate coupon code and calculate discount
    // For now, mock implementation
    cart.couponCode = couponCode;
    cart.discount = 50; // Example: ₹50 discount

    await cart.save();

    await cart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== REMOVE COUPON ====================
// Removes applied coupon from cart
export const removeCoupon = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const query = userId ? { userId } : { sessionId, userId: null };
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.couponCode = null;
    cart.discount = 0;

    await cart.save();

    await cart.populate([
      { path: "items.productId", select: "title name price images" },
      { path: "items.variantId", select: "variantName price images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
