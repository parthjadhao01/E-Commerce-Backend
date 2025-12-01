import express from "express";
import {
  createLoyaltyReward,
  getAllLoyaltyRewards,
  getLoyaltyRewardById,
  updateLoyaltyReward,
  deleteLoyaltyReward,
} from "../controllers/offerController/loyaltyRewardController.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/loyalty-rewards:
 *   get:
 *     summary: Get all loyalty rewards
 *     tags: [LoyaltyRewards]
 *     responses:
 *       200:
 *         description: List of all loyalty rewards
 *   post:
 *     summary: Create a loyalty reward
 *     tags: [LoyaltyRewards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyReward'
 *     responses:
 *       201:
 *         description: Loyalty reward created
 */
router.route("/").get(getAllLoyaltyRewards).post(createLoyaltyReward);

/**
 * @swagger
 * /api/admin/loyalty-rewards/{id}:
 *   get:
 *     summary: Get loyalty reward by ID
 *     tags: [LoyaltyRewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loyalty reward found
 *   put:
 *     summary: Update loyalty reward
 *     tags: [LoyaltyRewards]
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
 *             $ref: '#/components/schemas/LoyaltyReward'
 *     responses:
 *       200:
 *         description: Loyalty reward updated
 *   delete:
 *     summary: Delete loyalty reward
 *     tags: [LoyaltyRewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loyalty reward deleted
 */
router
  .route("/:id")
  .get(getLoyaltyRewardById)
  .put(updateLoyaltyReward)
  .delete(deleteLoyaltyReward);

export default router;
