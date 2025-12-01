import express from "express";
import {
  createFlashSale,
  getAllFlashSales,
  getFlashSaleById,
  updateFlashSale,
  deleteFlashSale,
} from "../controllers/offerController/flashSaleController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/flash-sales:
 *   get:
 *     summary: Get all flash sales
 *     tags: [FlashSales]
 *     responses:
 *       200:
 *         description: List of all flash sales
 *   post:
 *     summary: Create a flash sale
 *     tags: [FlashSales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FlashSale'
 *     responses:
 *       201:
 *         description: Flash sale created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllFlashSales)
  .post(protect, adminOnly, createFlashSale);

/**
 * @swagger
 * /api/admin/flash-sales/{id}:
 *   get:
 *     summary: Get flash sale by ID
 *     tags: [FlashSales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flash sale found
 *   put:
 *     summary: Update flash sale
 *     tags: [FlashSales]
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
 *             $ref: '#/components/schemas/FlashSale'
 *     responses:
 *       200:
 *         description: Flash sale updated
 *   delete:
 *     summary: Delete flash sale
 *     tags: [FlashSales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flash sale deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getFlashSaleById)
  .put(protect, adminOnly, updateFlashSale)
  .delete(protect, adminOnly, deleteFlashSale);

export default router;
