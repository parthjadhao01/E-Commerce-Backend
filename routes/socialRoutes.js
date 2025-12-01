import express from "express";

const router = express.Router();

    

/**
 * @swagger
 * /api/social/test:
 *   get:
 *     summary: Test social media route
 *     tags:
 *       - Social
 *     responses:
 *       200:
 *         description: Social media route is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Social media route is working" });
});

export default router;
