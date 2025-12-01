import express from "express";
import orderReplacementController from "../../controllers/orderHistory/orderReplacementController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderReplacement
 *   description: Handles product replacement flow separately from returns
 */
/**
 * @swagger
 * /api/order-replacements:
 *   post:
 *     summary: Create a new order replacement
 *     tags: [OrderReplacement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderReplacement'
 *     responses:
 *       201:
 *         description: Order replacement created
 *   get:
 *     summary: Get all order replacements
 *     tags: [OrderReplacement]
 *     responses:
 *       200:
 *         description: List of order replacements
 */
router.post("/", orderReplacementController.create);
router.get("/", orderReplacementController.getAll);
/**
 * @swagger
 * /api/order-replacements/{id}:
 *   get:
 *     summary: Get an order replacement by ID
 *     tags: [OrderReplacement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order replacement found
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an order replacement by ID
 *     tags: [OrderReplacement]
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
 *             $ref: '#/components/schemas/OrderReplacement'
 *     responses:
 *       200:
 *         description: Order replacement updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an order replacement by ID
 *     tags: [OrderReplacement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order replacement deleted
 *       404:
 *         description: Not found
 */
router.get("/:id", orderReplacementController.getById);
router.put("/:id", orderReplacementController.update);
router.delete("/:id", orderReplacementController.delete);

export default router;
