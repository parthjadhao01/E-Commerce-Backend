import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import Role from "./models/RoleModel.js";
import connectDB from "./config/db.js";

dotenv.config();

async function createAdmin() {
  await connectDB();

  const email = "admin@example.com";
  const password = "Admin@12345"; // Change this after first login!
  const name = "Super Admin";

  // Check if admin already exists
  let existing = await User.findOne({ email });
  if (existing) {
    // Update existing user to be admin if not already
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.status = "active";
      existing.isVerified = true;
      await existing.save();
      console.log("Existing user updated to admin role.");
    } else {
      console.log("Admin user already exists with correct role.");
    }
    process.exit(0);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create new admin user
  const adminUser = new User({
    name,
    email,
    passwordHash,
    role: "admin",
    status: "active",
    isVerified: true,
  });

  await adminUser.save();
  console.log("✅ Admin user created successfully!");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", password);
  console.log("⚠️  Please change the password after first login!");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});
