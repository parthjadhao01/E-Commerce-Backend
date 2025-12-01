import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import passport from "../config/passport.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully. Verification OTP sent to email.
 *       400:
 *         description: Name, Email/Phone and Password are required
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user email with OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP or email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email/phone and password (2FA step 1)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: OTP sent for 2FA. Please verify.
 *       400:
 *         description: Email/Phone and Password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/verify-login-otp:
 *   post:
 *     summary: Verify OTP for login (2FA step 2)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       400:
 *         description: OTP and Email/Phone are required or Invalid/expired OTP
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify-login-otp", verifyLoginOtp);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: If the email exists, a reset OTP has been sent.
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal Server Error
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Email, OTP, and new password are required or Invalid/expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Get a new access token using a refresh token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Refresh token missing or invalid
 *       500:
 *         description: Internal Server Error
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user (clear refresh token)
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/user/google:
 *   get:
 *     summary: Login with Google OAuth
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/user/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful Google login
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Issue JWT token for Google login
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  }
);

export default router;
