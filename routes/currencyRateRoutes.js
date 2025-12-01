import express from "express";
import {
  createCurrencyRate,
  getCurrencyRates,
  getCurrencyRate,
  updateCurrencyRate,
  deleteCurrencyRate,
} from "../controllers/currencyRateController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CurrencyRates
 *   description: Currency rate management
 */

/**
 * @swagger
 * /api/admin/currency-rates:
 *   post:
 *     summary: Create a new currency rate
 *     tags: [CurrencyRates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromCurrency
 *               - toCurrency
 *               - rate
 *             properties:
 *               fromCurrency:
 *                 type: string
 *               toCurrency:
 *                 type: string
 *               rate:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Currency rate created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", adminMiddleware, createCurrencyRate);

/**
 * @swagger
 * /api/admin/currency-rates:
 *   get:
 *     summary: Get all currency rates
 *     tags: [CurrencyRates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of currency rates
 *       500:
 *         description: Server error
 */
router.get("/", adminMiddleware, getCurrencyRates);

/**
 * @swagger
 * /api/admin/currency-rates/{id}:
 *   get:
 *     summary: Get a single currency rate by ID
 *     tags: [CurrencyRates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Currency rate ID
 *     responses:
 *       200:
 *         description: Currency rate data
 *       404:
 *         description: Currency rate not found
 *       500:
 *         description: Server error
 */
router.get("/:id", adminMiddleware, getCurrencyRate);

/**
 * @swagger
 * /api/admin/currency-rates/{id}:
 *   put:
 *     summary: Update a currency rate
 *     tags: [CurrencyRates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Currency rate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rate:
 *                 type: number
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validTo:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Currency rate updated
 *       404:
 *         description: Currency rate not found
 *       500:
 *         description: Server error
 */
router.put("/:id", adminMiddleware, updateCurrencyRate);

/**
 * @swagger
 * /api/admin/currency-rates/{id}:
 *   delete:
 *     summary: Delete a currency rate
 *     tags: [CurrencyRates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Currency rate ID
 *     responses:
 *       200:
 *         description: Currency rate deleted
 *       404:
 *         description: Currency rate not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", adminMiddleware, deleteCurrencyRate);

export default router;
