import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import connectDB from "./config/db.js";

dotenv.config();

async function resetAdmin() {
  await connectDB();

  const email = "admin@example.com";
  const password = "Admin@12345";
  const name = "Super Admin";

  // Delete existing admin if exists
  await User.deleteOne({ email });
  console.log("🗑️  Deleted existing admin (if any)");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create new admin user
  const adminUser = new User({
    name,
    email,
    passwordHash,
    roles: ["admin"], // roles is an array in the User model
    status: "active",
    emailVerified: true,
    phoneVerified: true,
  });

  await adminUser.save();
  console.log("✅ Admin user created successfully!");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", password);
  console.log("\n🚀 You can now login at: http://localhost:3000/sign-in");
  console.log("⚠️  Please change the password after first login!");
  process.exit(0);
}

resetAdmin().catch((err) => {
  console.error("Error resetting admin:", err);
  process.exit(1);
});
