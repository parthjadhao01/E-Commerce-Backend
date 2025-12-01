import express from "express";
import {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadBrandLogo } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, uploadBrandLogo, createBrand);

/**
 * @swagger
 * /api/admin/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getBrands);

/**
 * @swagger
 * /api/admin/brands/{id}:
 *   get:
 *     summary: Get a single brand by ID
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand data
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getBrand);

/**
 * @swagger
 * /api/admin/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated
 *       404:
 *         description: Brand not found
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, uploadBrandLogo, updateBrand);

/**
 * @swagger
 * /api/admin/brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteBrand);

export default router;
