import express from "express";
import {
  createPaymentTransaction,
  getAllPaymentTransactions,
  getPaymentTransactionById,
  updatePaymentTransaction,
  deletePaymentTransaction,
} from "../controllers/paymentTransactionController.js";

const router = express.Router();

/**
 * @swagger
 * /api/payment-transactions:
 *   get:
 *     summary: Get all payment transactions (admin or user)
 *     tags: [PaymentTransactions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID (optional)
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: Order ID (optional)
 *     responses:
 *       200:
 *         description: List of payment transactions
 *   post:
 *     summary: Create a payment transaction
 *     tags: [PaymentTransactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentTransaction'
 *     responses:
 *       201:
 *         description: Payment transaction created
 */
router.route("/").get(getAllPaymentTransactions).post(createPaymentTransaction);

/**
 * @swagger
 * /api/payment-transactions/{id}:
 *   get:
 *     summary: Get payment transaction by ID
 *     tags: [PaymentTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment transaction found
 *   put:
 *     summary: Update payment transaction (admin/gateway only)
 *     tags: [PaymentTransactions]
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
 *     responses:
 *       200:
 *         description: Payment transaction updated
 *   delete:
 *     summary: Delete payment transaction (admin only)
 *     tags: [PaymentTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment transaction deleted
 */
router
  .route("/:id")
  .get(getPaymentTransactionById)
  .put(updatePaymentTransaction)
  .delete(deletePaymentTransaction);

export default router;
