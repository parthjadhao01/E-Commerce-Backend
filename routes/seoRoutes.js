import express from "express";
import {
  createSeo,
  getSeos,
  getSeo,
  updateSeo,
  deleteSeo,
} from "../controllers/seoController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seo
 *   description: Product SEO management
 */

/**
 * @swagger
 * /api/admin/seo:
 *   post:
 *     summary: Create a new SEO entry
 *     tags: [Seo]
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
 *             properties:
 *               productId:
 *                 type: string
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               canonicalUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: SEO entry created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createSeo);

/**
 * @swagger
 * /api/admin/seo:
 *   get:
 *     summary: Get all SEO entries (optionally by product)
 *     tags: [Seo]
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
 *         description: List of SEO entries
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getSeos);

/**
 * @swagger
 * /api/admin/seo/{id}:
 *   get:
 *     summary: Get a single SEO entry by ID
 *     tags: [Seo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: SEO ID
 *     responses:
 *       200:
 *         description: SEO data
 *       404:
 *         description: SEO not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getSeo);

/**
 * @swagger
 * /api/admin/seo/{id}:
 *   put:
 *     summary: Update a SEO entry
 *     tags: [Seo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: SEO ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metaTitle:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               canonicalUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: SEO updated
 *       404:
 *         description: SEO not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateSeo);

/**
 * @swagger
 * /api/admin/seo/{id}:
 *   delete:
 *     summary: Delete a SEO entry
 *     tags: [Seo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: SEO ID
 *     responses:
 *       200:
 *         description: SEO deleted
 *       404:
 *         description: SEO not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteSeo);

export default router;
