import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";
import Device from "../models/DeviceModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOTP } from "../utils/generateOTP.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";

// lets start write our controller for auth acccording to the schemas

export const registerUser = async (req, res) => {
  // Here we will handle user registration logic
  const { name, email, phone, password } = req.body;

  if (!name || (!email && !phone) || !password) {
    return res
      .status(400)
      .json({ message: "Name, Email/Phone and Password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // roles can be assigned later, default role can be 'user'
    let userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      // Create default user role if it doesn't exist
      userRole = await Role.create({
        name: "user",
        displayName: "User",
        description: "Regular user with standard privileges",
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password, // will be hashed in pre-save hook
      roles: [userRole.name],
      status: "active",
      emailVerified: false,
      phoneVerified: false,
    });

    // Save the new user to the database before sending OTP
    await newUser.save();

    // send verification OTP if email is provided
    if (email) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      const emailSent = await sendVerificationEmail(email, otp);
      if (!emailSent) {
        return res
          .status(500)
          .json({ message: "Failed to send verification email." });
      }

      // Save OTP and expiry to in-memory store
      saveOTP(email, otp, expiresAt);

      return res.status(201).json({
        message:
          "User registered successfully. Verification OTP sent to email.",
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout controller: removes refresh token from DB and clears cookie
export const logout = async (req, res) => {
  try {
    // Get refresh token from cookie
    const token = req.cookies?.refreshToken;
    if (token) {
      // Remove refresh token from DB
      await RefreshToken.deleteOne({ token });
    }
    // Optionally, remove device info if tracked (e.g., by deviceId in cookie or header)
    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// verify email controller

export const verifyEmail = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Verify OTP
    const valid = verifyOTP(email, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // Set emailVerified to true
    user.emailVerified = true;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// login controller can be added similarly
export const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res
      .status(400)
      .json({ message: "Email/Phone and Password are required" });
  }
  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create or update device record
    const deviceInfo = {
      userId: user._id,
      deviceName: req.headers["user-agent"] || "Unknown Device",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };
    await Device.findOneAndUpdate(
      {
        userId: user._id,
        userAgent: deviceInfo.userAgent,
        ip: deviceInfo.ip,
      },
      deviceInfo,
      { upsert: true, new: true }
    );
    // Generate OTP for 2FA
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    saveOTP(user.email || user.phone, otp, expiresAt);
    // Send OTP (email preferred) in background for faster response
    if (user.email) {
      sendVerificationEmail(user.email, otp); // don't await
    } else {
      // Implement SMS sending for phone if needed
    }
    return res
      .status(200)
      .json({ message: "OTP sent for 2FA. Please verify." });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and Email are required" });
  }
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Verify OTP
    const valid = verifyOTP(email, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    // Issue JWT token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create and store refresh token
    const { rawToken } = await createRefreshToken(user._id);
    res.cookie("refreshToken", rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res
        .status(200)
        .json({ message: "If the email exists, a reset OTP has been sent." });
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    saveOTP(email, otp, expiresAt);
    sendVerificationEmail(email, otp); // don't await for speed
    return res
      .status(200)
      .json({ message: "If the email exists, a reset OTP has been sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const valid = verifyOTP(email, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper to create and store refresh token
export async function createRefreshToken(userId, deviceId = null) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(rawToken, 10);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const refreshToken = await RefreshToken.create({
    userId,
    tokenHash,
    deviceId,
    expiresAt,
  });
  return { rawToken, refreshToken };
}

// Helper to verify refresh token
export async function verifyRefreshToken(rawToken, userId) {
  const tokens = await RefreshToken.find({ userId });
  for (const tokenDoc of tokens) {
    const match = await bcrypt.compare(rawToken, tokenDoc.tokenHash);
    if (match && tokenDoc.expiresAt > new Date() && !tokenDoc.revoked) {
      return tokenDoc;
    }
  }
}

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const rawToken = req.cookies.refreshToken;
    if (!rawToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }
    // Find user by refresh token
    let userId = null;
    // Find the refresh token in DB
    const allTokens = await RefreshToken.find({});
    let tokenDoc = null;
    for (const t of allTokens) {
      const match = await bcrypt.compare(rawToken, t.tokenHash);
      if (match && t.expiresAt > new Date() && !t.revoked) {
        userId = t.userId;
        tokenDoc = t;
        break;
      }
    }
    if (!userId || !tokenDoc) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Issue new access token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
