import express from "express";
import orderHistoryController from "../../controllers/orderHistory/orderHistoryController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderHistory
 *   description: Tracks every order status change for auditing
 */
/**
 * @swagger
 * /api/order-history:
 *   post:
 *     summary: Create a new order history entry
 *     tags: [OrderHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderHistory'
 *     responses:
 *       201:
 *         description: Order history entry created
 *   get:
 *     summary: Get all order history entries
 *     tags: [OrderHistory]
 *     responses:
 *       200:
 *         description: List of order history entries
 */
router.post("/", orderHistoryController.create);
router.get("/", orderHistoryController.getAll);
/**
 * @swagger
 * /api/order-history/{id}:
 *   get:
 *     summary: Get an order history entry by ID
 *     tags: [OrderHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history entry found
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an order history entry by ID
 *     tags: [OrderHistory]
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
 *             $ref: '#/components/schemas/OrderHistory'
 *     responses:
 *       200:
 *         description: Order history entry updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an order history entry by ID
 *     tags: [OrderHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order history entry deleted
 *       404:
 *         description: Not found
 */
router.get("/:id", orderHistoryController.getById);
router.put("/:id", orderHistoryController.update);
router.delete("/:id", orderHistoryController.delete);

export default router;
