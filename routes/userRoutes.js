// routes/userRoutes.js
import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (user-facing)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (user-facing)
 *     tags: [User Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/products", userController.getAllProducts);

// need to implement this given below apis
router.get("/categories",userController.getAllCategories);
// router.get("/productdetail/:id")


export default router;
