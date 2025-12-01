import express from "express";
import {
  createShippingRule,
  getAllShippingRules,
  getShippingRuleById,
  updateShippingRule,
  deleteShippingRule,
} from "../controllers/shippingRuleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/shipping-rules:
 *   get:
 *     summary: Get all shipping rules
 *     tags: [ShippingRules]
 *     responses:
 *       200:
 *         description: List of all shipping rules
 *   post:
 *     summary: Create a shipping rule
 *     tags: [ShippingRules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingRule'
 *     responses:
 *       201:
 *         description: Shipping rule created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllShippingRules)
  .post(protect, adminOnly, createShippingRule);

/**
 * @swagger
 * /api/admin/shipping-rules/{id}:
 *   get:
 *     summary: Get shipping rule by ID
 *     tags: [ShippingRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipping rule found
 *   put:
 *     summary: Update shipping rule
 *     tags: [ShippingRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingRule'
 *     responses:
 *       200:
 *         description: Shipping rule updated
 *   delete:
 *     summary: Delete shipping rule
 *     tags: [ShippingRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipping rule deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getShippingRuleById)
  .put(protect, adminOnly, updateShippingRule)
  .delete(protect, adminOnly, deleteShippingRule);

export default router;
