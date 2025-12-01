import Category from "../models/product/CategoryModel.js";
import fs from "fs";
import path from "path";

// Helper function to delete old file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      parentId,
      level,
      icon,
      image,
      status,
      sortOrder,
      isFeatured,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    // Check for unique slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }

    // Handle file uploads or URL links
    let iconPath = icon || "";
    let imagePath = image || "";

    // If files are uploaded, use uploaded file paths
    if (req.files) {
      if (req.files.icon) {
        iconPath = `/uploads/categories/${req.files.icon[0].filename}`;
      }
      if (req.files.image) {
        imagePath = `/uploads/categories/${req.files.image[0].filename}`;
      }
    }

    const category = await Category.create({
      name,
      slug,
      parentId: parentId || null,
      level: level || 0,
      icon: iconPath,
      image: imagePath,
      status: status !== undefined ? status : true,
      sortOrder: sortOrder || 0,
      isFeatured: isFeatured || false,
      metaTitle,
      metaDescription,
    });

    res.status(201).json(category);
  } catch (err) {
    // Clean up uploaded files if category creation fails
    if (req.files) {
      if (req.files.icon) {
        deleteFile(`./uploads/categories/${req.files.icon[0].filename}`);
      }
      if (req.files.image) {
        deleteFile(`./uploads/categories/${req.files.image[0].filename}`);
      }
    }
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single category by ID
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      parentId,
      level,
      icon,
      image,
      status,
      sortOrder,
      isFeatured,
      metaTitle,
      metaDescription,
    } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Check for unique slug if changed
    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      category.slug = slug;
    }

    // Update fields
    if (name) category.name = name;
    if (parentId !== undefined) category.parentId = parentId || null;
    if (level !== undefined) category.level = level;
    if (status !== undefined) category.status = status;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isFeatured !== undefined) category.isFeatured = isFeatured;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      category.metaDescription = metaDescription;

    // Handle file uploads or URL links
    // Icon update
    if (req.files && req.files.icon) {
      // Delete old icon file if it exists and is a local file
      if (category.icon && category.icon.startsWith("/uploads/")) {
        deleteFile(`.${category.icon}`);
      }
      category.icon = `/uploads/categories/${req.files.icon[0].filename}`;
    } else if (icon !== undefined) {
      // If URL is provided instead of file
      if (category.icon && category.icon.startsWith("/uploads/")) {
        deleteFile(`.${category.icon}`);
      }
      category.icon = icon;
    }

    // Image update
    if (req.files && req.files.image) {
      // Delete old image file if it exists and is a local file
      if (category.image && category.image.startsWith("/uploads/")) {
        deleteFile(`.${category.image}`);
      }
      category.image = `/uploads/categories/${req.files.image[0].filename}`;
    } else if (image !== undefined) {
      // If URL is provided instead of file
      if (category.image && category.image.startsWith("/uploads/")) {
        deleteFile(`.${category.image}`);
      }
      category.image = image;
    }

    await category.save();
    res.json(category);
  } catch (err) {
    // Clean up uploaded files if update fails
    if (req.files) {
      if (req.files.icon) {
        deleteFile(`./uploads/categories/${req.files.icon[0].filename}`);
      }
      if (req.files.image) {
        deleteFile(`./uploads/categories/${req.files.image[0].filename}`);
      }
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Delete associated files if they are local uploads
    if (category.icon && category.icon.startsWith("/uploads/")) {
      deleteFile(`.${category.icon}`);
    }
    if (category.image && category.image.startsWith("/uploads/")) {
      deleteFile(`.${category.image}`);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
