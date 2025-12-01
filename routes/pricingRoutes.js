import express from "express";
import {
  createProductPricing,
  getProductPricings,
  getProductPricing,
  updateProductPricing,
  deleteProductPricing,
  createTierPricing,
  getTierPricings,
  getTierPricing,
  updateTierPricing,
  deleteTierPricing,
  createSpecialPricing,
  getSpecialPricings,
  getSpecialPricing,
  updateSpecialPricing,
  deleteSpecialPricing,
} from "../controllers/pricingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pricing
 *   description: Product pricing management
 */

// IMPORTANT: Route order matters! Specific routes (like /tier, /special)
// must come BEFORE parameterized routes (like /:id) to avoid conflicts.
// Otherwise, "tier" and "special" will be treated as :id parameters.

// Product Pricing
/**
 * @swagger
 * /api/admin/pricing:
 *   post:
 *     summary: Create product pricing
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - price
 *             properties:
 *               productId:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Pricing created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createProductPricing);

/**
 * @swagger
 * /api/admin/pricing:
 *   get:
 *     summary: Get all product pricings (optionally by product)
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: List of pricings
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getProductPricings);

// Tier Pricing Routes (must come BEFORE /:id routes)
router.post("/tier", protect, adminOnly, createTierPricing);
router.get("/tier", protect, adminOnly, getTierPricings);
router.get("/tier/:id", protect, adminOnly, getTierPricing);
router.put("/tier/:id", protect, adminOnly, updateTierPricing);
router.delete("/tier/:id", protect, adminOnly, deleteTierPricing);

// Special Pricing Routes (must come BEFORE /:id routes)
router.post("/special", protect, adminOnly, createSpecialPricing);
router.get("/special", protect, adminOnly, getSpecialPricings);
router.get("/special/:id", protect, adminOnly, getSpecialPricing);
router.put("/special/:id", protect, adminOnly, updateSpecialPricing);
router.delete("/special/:id", protect, adminOnly, deleteSpecialPricing);

/**
 * @swagger
 * /api/admin/pricing/{id}:
 *   get:
 *     summary: Get a single product pricing by ID
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pricing ID
 *     responses:
 *       200:
 *         description: Pricing data
 *       404:
 *         description: Pricing not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getProductPricing);

/**
 * @swagger
 * /api/admin/pricing/{id}:
 *   put:
 *     summary: Update product pricing
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pricing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pricing updated
 *       404:
 *         description: Pricing not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateProductPricing);

/**
 * @swagger
 * /api/admin/pricing/{id}:
 *   delete:
 *     summary: Delete product pricing
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pricing ID
 *     responses:
 *       200:
 *         description: Pricing deleted
 *       404:
 *         description: Pricing not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteProductPricing);

export default router;
