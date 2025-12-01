import express from "express";
import {
  createAutoDiscount,
  getAllAutoDiscounts,
  getAutoDiscountById,
  updateAutoDiscount,
  deleteAutoDiscount,
} from "../controllers/offerController/autoDiscountController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/auto-discounts:
 *   get:
 *     summary: Get all auto discounts
 *     tags: [AutoDiscounts]
 *     responses:
 *       200:
 *         description: List of all auto discounts
 *   post:
 *     summary: Create an auto discount
 *     tags: [AutoDiscounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutoDiscount'
 *     responses:
 *       200:
 *         description: Auto discount created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllAutoDiscounts)
  .post(protect, adminOnly, createAutoDiscount);

/**
 * @swagger
 * /api/admin/auto-discounts/{id}:
 *   get:
 *     summary: Get auto discount by ID
 *     tags: [AutoDiscounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto discount found
 *   put:
 *     summary: Update auto discount
 *     tags: [AutoDiscounts]
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
 *             $ref: '#/components/schemas/AutoDiscount'
 *     responses:
 *       200:
 *         description: Auto discount updated
 *   delete:
 *     summary: Delete auto discount
 *     tags: [AutoDiscounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto discount deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getAutoDiscountById)
  .put(protect, adminOnly, updateAutoDiscount)
  .delete(protect, adminOnly, deleteAutoDiscount);

export default router;
