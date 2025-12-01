import express from "express";
import {
  createStockLog,
  getStockLogs,
  getStockLog,
  updateStockLog,
  deleteStockLog,
} from "../controllers/stockLogController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: StockLogs
 *   description: Product stock log management
 */

/**
 * @swagger
 * /api/admin/stock-logs:
 *   post:
 *     summary: Create a new stock log
 *     tags: [StockLogs]
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
 *               - change
 *             properties:
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               change:
 *                 type: number
 *               reason:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stock log created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", protect, adminOnly, createStockLog);

/**
 * @swagger
 * /api/admin/stock-logs:
 *   get:
 *     summary: Get all stock logs (optionally by product/variant)
 *     tags: [StockLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *       - in: query
 *         name: variantId
 *         schema:
 *           type: string
 *         description: Filter by variant ID
 *     responses:
 *       200:
 *         description: List of stock logs
 *       500:
 *         description: Server error
 */
router.get("/", protect, adminOnly, getStockLogs);

/**
 * @swagger
 * /api/admin/stock-logs/{id}:
 *   get:
 *     summary: Get a single stock log by ID
 *     tags: [StockLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock log ID
 *     responses:
 *       200:
 *         description: Stock log data
 *       404:
 *         description: Stock log not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, adminOnly, getStockLog);

/**
 * @swagger
 * /api/admin/stock-logs/{id}:
 *   put:
 *     summary: Update a stock log
 *     tags: [StockLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock log ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [in, out]
 *               quantity:
 *                 type: number
 *               source:
 *                 type: string
 *                 enum: [manual, order, return]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock log updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Stock log not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, adminOnly, updateStockLog);

/**
 * @swagger
 * /api/admin/stock-logs/{id}:
 *   delete:
 *     summary: Delete a stock log
 *     tags: [StockLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock log ID
 *     responses:
 *       200:
 *         description: Stock log deleted
 *       404:
 *         description: Stock log not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, adminOnly, deleteStockLog);

export default router;
