import express from "express";
import {
  createVariant,
  getVariants,
  getVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/variantController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Variants
 *   description: Admin product variant management
 */

/**
 * @swagger
 * /api/admin/variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Variants]
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
 *               - sku
 *             properties:
 *               productId:
 *                 type: string
 *               sku:
 *                 type: string
 *               attributes:
 *                 type: object
 *                 description: Attribute-value pairs
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               status:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 description: Image URL
 *     responses:
 *       201:
 *         description: Variant created
 *       400:
 *         description: Validation error
 *       409:
 *         description: SKU already exists for this product
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createVariant);

/**
 * @swagger
 * /api/admin/variants:
 *   get:
 *     summary: Get all variants (optionally by product)
 *     tags: [Variants]
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
 *         description: List of variants
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getVariants);
/**
 * @swagger
 * /api/admin/variants/{id}:
 *   get:
 *     summary: Get a single variant by ID
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant data
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getVariant);

/**
 * @swagger
 * /api/admin/variants/{id}:
 *   put:
 *     summary: Update a variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               attributes:
 *                 type: object
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               status:
 *                 type: boolean
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Variant updated
 *       404:
 *         description: Variant not found
 *       409:
 *         description: SKU already exists for this product
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateVariant);

/**
 * @swagger
 * /api/admin/variants/{id}:
 *   delete:
 *     summary: Delete a variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteVariant);

export default router;
