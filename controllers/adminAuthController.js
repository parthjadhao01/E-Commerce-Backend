import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc    Admin Registration
 * @route   POST /api/admin/auth/register
 * @access  Public (but should be restricted in production)
 */
export const registerAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  console.log("Admin registration attempt for:", email);
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  try {
    // Check if admin already exists
    console.log("Checking if admin already exists...");
    const existingAdmin = await User.findOne({
      email,
      role: "admin",
    });
    console.log("Admin found:", existingAdmin ? "Yes" : "No");
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      phone,
      passwordHash,
      roles: ["admin"], // roles is an array in the User model
      emailVerified: true, // Auto-verify admin accounts
      phoneVerified: true,
      status: "active",
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        roles: admin.roles,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    console.log("Admin registered successfully");
    // Return response
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        roles: admin.roles,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin registration",
    });
  }
};

/**
 * @desc    Admin Login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Find admin by email and check if roles array includes "admin"
    const admin = await User.findOne({
      email,
      roles: "admin", // Mongoose will check if array contains "admin"
    });

    console.log("Admin login attempt for:", email);
    console.log("Admin found:", admin ? "Yes" : "No");
    if (admin) {
      console.log("Admin roles:", admin.roles);
      console.log("Admin status:", admin.status);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if admin account is active
    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is not active",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        roles: admin.roles,
      },
      process.env.JWT_SECRET || "vishalchavan07",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return response
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        roles: admin.roles,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
};

/**
 * @desc    Get Admin Profile
 * @route   GET /api/admin/auth/profile
 * @access  Private (Admin only)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-passwordHash");

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Update Admin Profile
 * @route   PUT /api/admin/auth/profile
 * @access  Private (Admin only)
 */
export const updateAdminProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;

  try {
    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (avatar) admin.avatar = avatar;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/admin/auth/change-password
 * @access  Private (Admin only)
 */
export const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  try {
    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change admin password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/auth/logout
 * @access  Private (Admin only)
 */
export const logoutAdmin = async (req, res) => {
  try {
    // Clear token from cookies if using cookies
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
