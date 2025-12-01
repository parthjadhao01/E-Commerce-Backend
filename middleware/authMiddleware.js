import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret"
      );

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-passwordHash");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

/**
 * Admin only middleware
 */
export const adminOnly = (req, res, next) => {
  console.log(
    "[ADMINONLY MIDDLEWARE] Called, req.user:",
    req.user ? `${req.user.email} with roles: ${req.user.roles}` : "NO USER"
  );
  if (req.user && req.user.roles && req.user.roles.includes("admin")) {
    console.log("[ADMINONLY MIDDLEWARE] Admin access granted");
    next();
  } else {
    console.log("[ADMINONLY MIDDLEWARE] Access denied");
    res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};

/**
 * User only middleware
 */
export const userOnly = (req, res, next) => {
  if (req.user && req.user.roles && req.user.roles.includes("user")) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. User only.",
    });
  }
};
