import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadCategoryImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();
// Updated to use protect and adminOnly middleware

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Admin category management
 */

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               parentId:
 *                 type: string
 *                 description: Parent category ID
 *               level:
 *                 type: integer
 *                 description: Category level
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, uploadCategoryImages, createCategory);

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getCategories);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
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
 *               parentId:
 *                 type: string
 *                 description: Parent category ID
 *               level:
 *                 type: integer
 *                 description: Category level
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, uploadCategoryImages, updateCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
