import express from "express";
import {
  addToCart,
  getCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
  mergeCarts,
  applyCoupon,
  removeCoupon,
} from "../controllers/cartController.js";

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart by userId or sessionId
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (for logged-in users)
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Session ID (for guests)
 *     responses:
 *       200:
 *         description: Cart found
 *   post:
 *     summary: Add item to cart (or update)
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.route("/").get(getCart).post(addToCart);

/**
 * @swagger
 * /api/cart/item:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete("/item", removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   post:
 *     summary: Clear cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.post("/clear", clearCart);

/**
 * @swagger
 * /api/cart/update-quantity:
 *   put:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item quantity updated
 */
router.put("/update-quantity", updateItemQuantity);

/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart with user cart (on login)
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Carts merged successfully
 */
router.post("/merge", mergeCarts);

/**
 * @swagger
 * /api/cart/apply-coupon:
 *   post:
 *     summary: Apply coupon code to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 */
router.post("/apply-coupon", applyCoupon);

/**
 * @swagger
 * /api/cart/remove-coupon:
 *   post:
 *     summary: Remove applied coupon from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Coupon removed successfully
 */
router.post("/remove-coupon", removeCoupon);

export default router;
