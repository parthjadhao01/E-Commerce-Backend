import express from "express";
import {
  createOrderSummary,
  getAllOrderSummaries,
  getOrderSummaryById,
  updateOrderSummary,
  deleteOrderSummary,
} from "../controllers/orderSummaryController.js";

const router = express.Router();

/**
 * @swagger
 * /api/order-summaries:
 *   get:
 *     summary: Get all order summaries (admin or user)
 *     tags: [OrderSummaries]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (optional, for user-specific summaries)
 *     responses:
 *       200:
 *         description: List of order summaries
 *   post:
 *     summary: Create order summary
 *     tags: [OrderSummaries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderSummary'
 *     responses:
 *       201:
 *         description: Order summary created
 */
router.route("/").get(getAllOrderSummaries).post(createOrderSummary);

/**
 * @swagger
 * /api/order-summaries/{id}:
 *   get:
 *     summary: Get order summary by ID
 *     tags: [OrderSummaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order summary found
 *   put:
 *     summary: Update order summary
 *     tags: [OrderSummaries]
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
 *             $ref: '#/components/schemas/OrderSummary'
 *     responses:
 *       200:
 *         description: Order summary updated
 *   delete:
 *     summary: Delete order summary
 *     tags: [OrderSummaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order summary deleted
 */
router
  .route("/:id")
  .get(getOrderSummaryById)
  .put(updateOrderSummary)
  .delete(deleteOrderSummary);

export default router;
