import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin or user)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (optional, for user-specific orders)
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Create a new order (checkout)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created
 */
router.route("/").get(getAllOrders).post(createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated
 *   delete:
 *     summary: Delete order (admin only)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 */
router
  .route("/:id")
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

export default router;
