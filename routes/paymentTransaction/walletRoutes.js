import express from "express";
import walletController from "../../controllers/paymentTransaction/walletController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management
 */

/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wallet'
 *     responses:
 *       201:
 *         description: Wallet created
 *   get:
 *     summary: Get all wallets
 *     tags: [Wallets]
 *     responses:
 *       200:
 *         description: List of wallets
 */
router.post("/", walletController.createWallet);
router.get("/", walletController.getAllWallets);

/**
 * @swagger
 * /api/wallets/{id}:
 *   get:
 *     summary: Get a wallet by ID
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wallet found
 *       404:
 *         description: Wallet not found
 *   put:
 *     summary: Update a wallet by ID
 *     tags: [Wallets]
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
 *             $ref: '#/components/schemas/Wallet'
 *     responses:
 *       200:
 *         description: Wallet updated
 *       404:
 *         description: Wallet not found
 *   delete:
 *     summary: Delete a wallet by ID
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wallet deleted
 *       404:
 *         description: Wallet not found
 */
router.get("/:id", walletController.getWalletById);
router.put("/:id", walletController.updateWallet);
router.delete("/:id", walletController.deleteWallet);

export default router;
