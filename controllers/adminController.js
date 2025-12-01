import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a user's role
export const updateUserRole = async (req, res) => {
  const { roles } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  const { name, displayName, description } = req.body;
  try {
    const role = await Role.create({ name, displayName, description });
    return res.status(201).json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get system stats
export const getSystemStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ roles: "admin" });
    return res.status(200).json({ userCount, adminCount });
  } catch (error) {
    console.error("Error getting stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  createRole,
  getSystemStats,
};
