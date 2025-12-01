import express from "express";
import {
  createBuyXGetY,
  getAllBuyXGetY,
  getBuyXGetYById,
  updateBuyXGetY,
  deleteBuyXGetY,
} from "../controllers/offerController/buyXGetYController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/buy-x-get-y:
 *   get:
 *     summary: Get all Buy X Get Y offers
 *     tags: [BuyXGetY]
 *     responses:
 *       200:
 *         description: List of all Buy X Get Y offers
 *   post:
 *     summary: Create a Buy X Get Y offer
 *     tags: [BuyXGetY]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyXGetY'
 *     responses:
 *       201:
 *         description: Offer created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllBuyXGetY)
  .post(protect, adminOnly, createBuyXGetY);

/**
 * @swagger
 * /api/admin/buy-x-get-y/{id}:
 *   get:
 *     summary: Get Buy X Get Y offer by ID
 *     tags: [BuyXGetY]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer found
 *   put:
 *     summary: Update Buy X Get Y offer
 *     tags: [BuyXGetY]
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
 *             $ref: '#/components/schemas/BuyXGetY'
 *     responses:
 *       200:
 *         description: Offer updated
 *   delete:
 *     summary: Delete Buy X Get Y offer
 *     tags: [BuyXGetY]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getBuyXGetYById)
  .put(protect, adminOnly, updateBuyXGetY)
  .delete(protect, adminOnly, deleteBuyXGetY);

export default router;
