import express from "express";
import {
  createTaxRule,
  getTaxRules,
  getTaxRule,
  updateTaxRule,
  deleteTaxRule,
} from "../controllers/taxRuleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TaxRules
 *   description: Product tax rule management
 */

/**
 * @swagger
 * /api/admin/tax-rules:
 *   post:
 *     summary: Create a new tax rule
 *     tags: [TaxRules]
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
 *               - rate
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tax rule created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createTaxRule);

/**
 * @swagger
 * /api/admin/tax-rules:
 *   get:
 *     summary: Get all tax rules
 *     tags: [TaxRules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tax rules
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getTaxRules);

/**
 * @swagger
 * /api/admin/tax-rules/{id}:
 *   get:
 *     summary: Get a single tax rule by ID
 *     tags: [TaxRules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tax rule ID
 *     responses:
 *       200:
 *         description: Tax rule data
 *       404:
 *         description: Tax rule not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getTaxRule);

/**
 * @swagger
 * /api/admin/tax-rules/{id}:
 *   put:
 *     summary: Update a tax rule
 *     tags: [TaxRules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tax rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rate:
 *                 type: number
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tax rule updated
 *       404:
 *         description: Tax rule not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateTaxRule);

/**
 * @swagger
 * /api/admin/tax-rules/{id}:
 *   delete:
 *     summary: Delete a tax rule
 *     tags: [TaxRules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tax rule ID
 *     responses:
 *       200:
 *         description: Tax rule deleted
 *       404:
 *         description: Tax rule not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteTaxRule);

export default router;
