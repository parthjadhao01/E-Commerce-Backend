import express from "express";
import paymentCallbackController from "../../controllers/paymentTransaction/paymentCallbackController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PaymentCallbacks
 *   description: Payment callback log management
 */

/**
 * @swagger
 * /api/payment-callbacks:
 *   post:
 *     summary: Create a new payment callback log
 *     tags: [PaymentCallbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCallback'
 *     responses:
 *       201:
 *         description: Payment callback log created
 *   get:
 *     summary: Get all payment callback logs
 *     tags: [PaymentCallbacks]
 *     responses:
 *       200:
 *         description: List of payment callback logs
 */
router.post("/", paymentCallbackController.createPaymentCallback);
router.get("/", paymentCallbackController.getAllPaymentCallbacks);

/**
 * @swagger
 * /api/payment-callbacks/{id}:
 *   get:
 *     summary: Get a payment callback log by ID
 *     tags: [PaymentCallbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment callback log found
 *       404:
 *         description: Payment callback log not found
 *   put:
 *     summary: Update a payment callback log by ID
 *     tags: [PaymentCallbacks]
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
 *             $ref: '#/components/schemas/PaymentCallback'
 *     responses:
 *       200:
 *         description: Payment callback log updated
 *       404:
 *         description: Payment callback log not found
 *   delete:
 *     summary: Delete a payment callback log by ID
 *     tags: [PaymentCallbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment callback log deleted
 *       404:
 *         description: Payment callback log not found
 */
router.get("/:id", paymentCallbackController.getPaymentCallbackById);
router.put("/:id", paymentCallbackController.updatePaymentCallback);
router.delete("/:id", paymentCallbackController.deletePaymentCallback);

export default router;
