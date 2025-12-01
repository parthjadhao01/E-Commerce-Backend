// middleware/adminMiddleware.js
import User from "../models/UserModel.js";

export default async function adminMiddleware(req, res, next) {
  try {
    // Assumes req.user is set by previous auth middleware (e.g., JWT verification)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }
    // If roles are populated as array of role names
    if (Array.isArray(req.user.roles) && req.user.roles.includes("admin")) {
      return next();
    }
    // If roles are objects (e.g., [{name: 'admin'}])
    if (
      Array.isArray(req.user.roles) &&
      req.user.roles.some((r) => r.name === "admin")
    ) {
      return next();
    }
    // Optionally, fetch user from DB if roles not present
    const user = await User.findById(req.user._id).populate("roles");
    if (
      user &&
      Array.isArray(user.roles) &&
      (user.roles.includes("admin") ||
        user.roles.some((r) => r.name === "admin"))
    ) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Admins only" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
