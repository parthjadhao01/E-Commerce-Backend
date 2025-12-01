import express from "express";
import {
  createAttribute,
  getAttributes,
  getAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attributeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attributes
 *   description: Admin attribute management
 */

/**
 * @swagger
 * /api/admin/attributes:
 *   post:
 *     summary: Create a new attribute
 *     tags: [Attributes]
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
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               type:
 *                 type: string
 *                 description: Attribute type (e.g. select, text, color)
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Possible values for select-type attributes
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attribute created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createAttribute);

/**
 * @swagger
 * /api/admin/attributes:
 *   get:
 *     summary: Get all attributes
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of attributes
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getAttributes);

/**
 * @swagger
 * /api/admin/attributes/{id}:
 *   get:
 *     summary: Get a single attribute by ID
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute data
 *       404:
 *         description: Attribute not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getAttribute);

/**
 * @swagger
 * /api/admin/attributes/{id}:
 *   put:
 *     summary: Update an attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attribute ID
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
 *               type:
 *                 type: string
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attribute updated
 *       404:
 *         description: Attribute not found
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateAttribute);

/**
 * @swagger
 * /api/admin/attributes/{id}:
 *   delete:
 *     summary: Delete an attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attribute ID
 *     responses:
 *       200:
 *         description: Attribute deleted
 *       404:
 *         description: Attribute not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteAttribute);

export default router;
