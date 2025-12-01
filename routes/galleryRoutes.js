import express from "express";
import {
  getProductGallery,
  addImageToGallery,
  updateImageInGallery,
  deleteImageFromGallery,
  deleteProductGallery,
} from "../controllers/galleryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Product gallery image management
 */

// Get gallery for a product
router.get("/product/:productId", protect, adminOnly, getProductGallery);

// Add image to product gallery
router.post("/product/:productId", protect, adminOnly, addImageToGallery);

// Update specific image in gallery
router.put(
  "/product/:productId/image/:imageIndex",
  protect,
  adminOnly,
  updateImageInGallery
);

// Delete specific image from gallery
router.delete(
  "/product/:productId/image/:imageIndex",
  protect,
  adminOnly,
  deleteImageFromGallery
);

// Delete entire gallery
router.delete("/product/:productId", protect, adminOnly, deleteProductGallery);

export default router;
