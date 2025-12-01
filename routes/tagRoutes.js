import express from "express";
import {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Product tag management
 */

/**
 * @swagger
 * /api/admin/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
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
 *         description: Tag created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createTag);

/**
 * @swagger
 * /api/admin/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getTags);

/**
 * @swagger
 * /api/admin/tags/{id}:
 *   get:
 *     summary: Get a single tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag data
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getTag);

/**
 * @swagger
 * /api/admin/tags/{id}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
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
 *         description: Tag updated
 *       404:
 *         description: Tag not found
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateTag);

/**
 * @swagger
 * /api/admin/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteTag);

export default router;
