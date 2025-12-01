import express from "express";
import {
  createComboOffer,
  getAllComboOffers,
  getComboOfferById,
  updateComboOffer,
  deleteComboOffer,
} from "../controllers/offerController/comboOfferController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/combo-offers:
 *   get:
 *     summary: Get all combo offers
 *     tags: [ComboOffers]
 *     responses:
 *       200:
 *         description: List of all combo offers
 *   post:
 *     summary: Create a combo offer
 *     tags: [ComboOffers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComboOffer'
 *     responses:
 *       201:
 *         description: Combo offer created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllComboOffers)
  .post(protect, adminOnly, createComboOffer);

/**
 * @swagger
 * /api/admin/combo-offers/{id}:
 *   get:
 *     summary: Get combo offer by ID
 *     tags: [ComboOffers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Combo offer found
 *   put:
 *     summary: Update combo offer
 *     tags: [ComboOffers]
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
 *             $ref: '#/components/schemas/ComboOffer'
 *     responses:
 *       200:
 *         description: Combo offer updated
 *   delete:
 *     summary: Delete combo offer
 *     tags: [ComboOffers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Combo offer deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getComboOfferById)
  .put(protect, adminOnly, updateComboOffer)
  .delete(protect, adminOnly, deleteComboOffer);

export default router;
