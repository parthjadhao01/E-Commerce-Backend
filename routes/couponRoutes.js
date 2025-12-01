import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/offerController/couponController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of all coupons
 *   post:
 *     summary: Create a coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       201:
 *         description: Coupon created
 */
router
  .route("/")
  .get(protect, adminOnly, getAllCoupons)
  .post(protect, adminOnly, createCoupon);

/**
 * @swagger
 * /api/admin/coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon found
 *   put:
 *     summary: Update coupon
 *     tags: [Coupons]
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
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       200:
 *         description: Coupon updated
 *   delete:
 *     summary: Delete coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deleted
 */
router
  .route("/:id")
  .get(protect, adminOnly, getCouponById)
  .put(protect, adminOnly, updateCoupon)
  .delete(protect, adminOnly, deleteCoupon);

export default router;
