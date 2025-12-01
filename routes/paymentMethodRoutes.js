import express from "express";
import {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethodController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/payment-methods:
 *   get:
 *     summary: Get all payment methods
 *     tags: [PaymentMethods]
 *     responses:
 *       200:
 *         description: List of all payment methods
 *   post:
 *     summary: Create a payment method
 *     tags: [PaymentMethods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       201:
 *         description: Payment method created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllPaymentMethods)
  .post(protect, adminOnly, createPaymentMethod);


/**
 * @swagger
 * /api/admin/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method found
 *   put:
 *     summary: Update payment method
 *     tags: [PaymentMethods]
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
 *             $ref: '#/components/schemas/PaymentMethod'
 *     responses:
 *       200:
 *         description: Payment method updated
 *   delete:
 *     summary: Delete payment method
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getPaymentMethodById)
  .put(protect, adminOnly, updatePaymentMethod)
  .delete(protect, adminOnly, deletePaymentMethod);

export default router;
