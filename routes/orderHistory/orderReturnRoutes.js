import express from "express";
import orderReturnController from "../../controllers/orderHistory/orderReturnController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderReturn
 *   description: Manages return requests with item-level return support
 */
/**
 * @swagger
 * /api/order-returns:
 *   post:
 *     summary: Create a new order return
 *     tags: [OrderReturn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderReturn'
 *     responses:
 *       201:
 *         description: Order return created
 *   get:
 *     summary: Get all order returns
 *     tags: [OrderReturn]
 *     responses:
 *       200:
 *         description: List of order returns
 */
router.post("/", orderReturnController.create);
router.get("/", orderReturnController.getAll);
/**
 * @swagger
 * /api/order-returns/{id}:
 *   get:
 *     summary: Get an order return by ID
 *     tags: [OrderReturn]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order return found
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an order return by ID
 *     tags: [OrderReturn]
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
 *             $ref: '#/components/schemas/OrderReturn'
 *     responses:
 *       200:
 *         description: Order return updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an order return by ID
 *     tags: [OrderReturn]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order return deleted
 *       404:
 *         description: Not found
 */
router.get("/:id", orderReturnController.getById);
router.put("/:id", orderReturnController.update);
router.delete("/:id", orderReturnController.delete);

export default router;
