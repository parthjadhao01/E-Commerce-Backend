import express from "express";
import {
  createFaq,
  getFaqs,
  getFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Faqs
 *   description: Product FAQ management
 */

/**
 * @swagger
 * /api/admin/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [Faqs]
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
 *               - question
 *               - answer
 *             properties:
 *               productId:
 *                 type: string
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: FAQ created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createFaq);

/**
 * @swagger
 * /api/admin/faqs:
 *   get:
 *     summary: Get all FAQs (optionally by product)
 *     tags: [Faqs]
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
 *         description: List of FAQs
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getFaqs);

/**
 * @swagger
 * /api/admin/faqs/{id}:
 *   get:
 *     summary: Get a single FAQ by ID
 *     tags: [Faqs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ data
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getFaq);

/**
 * @swagger
 * /api/admin/faqs/{id}:
 *   put:
 *     summary: Update a FAQ
 *     tags: [Faqs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateFaq);

/**
 * @swagger
 * /api/admin/faqs/{id}:
 *   delete:
 *     summary: Delete a FAQ
 *     tags: [Faqs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ deleted
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteFaq);

export default router;
