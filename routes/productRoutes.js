import express from "express";
import * as productController from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadProductThumbnail } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protect all product routes with admin middleware
router.use(protect, adminOnly);

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing or invalid fields
 *       409:
 *         description: Slug or SKU already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/", uploadProductThumbnail, productController.createProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *       409:
 *         description: Slug or SKU already exists
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", uploadProductThumbnail, productController.updateProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", productController.deleteProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", productController.getProduct);

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (with filters)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter by status
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [simple, variable]
 *         description: Filter by product type
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Text search
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", productController.getProducts);

export default router;
