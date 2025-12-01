import express from "express";
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/userAddressController.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/addresses:
 *   get:
 *     summary: Get all addresses for a user
 *     tags: [UserAddresses]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of addresses
 *   post:
 *     summary: Create a new address
 *     tags: [UserAddresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAddress'
 *     responses:
 *       201:
 *         description: Address created
 */
router.route("/").get(getUserAddresses).post(createAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [UserAddresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address found
 *   put:
 *     summary: Update address
 *     tags: [UserAddresses]
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
 *             $ref: '#/components/schemas/UserAddress'
 *     responses:
 *       200:
 *         description: Address updated
 *   delete:
 *     summary: Delete address
 *     tags: [UserAddresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 */
router
  .route("/:id")
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
