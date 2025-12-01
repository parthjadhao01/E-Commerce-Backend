import express from "express";
import partialPaymentController from "../../controllers/paymentTransaction/partialPaymentController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PartialPayments
 *   description: Partial payment management
 */

/**
 * @swagger
 * /api/partial-payments:
 *   post:
 *     summary: Create a new partial payment
 *     tags: [PartialPayments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartialPayment'
 *     responses:
 *       201:
 *         description: Partial payment created
 *   get:
 *     summary: Get all partial payments
 *     tags: [PartialPayments]
 *     responses:
 *       200:
 *         description: List of partial payments
 */
router.post("/", partialPaymentController.createPartialPayment);
router.get("/", partialPaymentController.getAllPartialPayments);

/**
 * @swagger
 * /api/partial-payments/{id}:
 *   get:
 *     summary: Get a partial payment by ID
 *     tags: [PartialPayments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partial payment found
 *       404:
 *         description: Partial payment not found
 *   put:
 *     summary: Update a partial payment by ID
 *     tags: [PartialPayments]
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
 *             $ref: '#/components/schemas/PartialPayment'
 *     responses:
 *       200:
 *         description: Partial payment updated
 *       404:
 *         description: Partial payment not found
 *   delete:
 *     summary: Delete a partial payment by ID
 *     tags: [PartialPayments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partial payment deleted
 *       404:
 *         description: Partial payment not found
 */
router.get("/:id", partialPaymentController.getPartialPaymentById);
router.put("/:id", partialPaymentController.updatePartialPayment);
router.delete("/:id", partialPaymentController.deletePartialPayment);

export default router;
