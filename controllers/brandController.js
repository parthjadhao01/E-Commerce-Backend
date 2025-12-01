import Brand from "../models/product/BrandModel.js";
import fs from "fs";
import path from "path";

// Helper function to delete old file
const deleteFile = (filePath) => {
  if (
    filePath &&
    filePath.startsWith("/uploads/") &&
    fs.existsSync(`.${filePath}`)
  ) {
    fs.unlinkSync(`.${filePath}`);
  }
};

// Create a new brand
export const createBrand = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      logo,
      website,
      status,
      isFeatured,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    // Check for unique slug
    const existing = await Brand.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug already exists" });
    }

    // Handle logo (file upload or URL)
    let logoPath = logo || "";

    // If file is uploaded, use uploaded file path
    if (req.file) {
      logoPath = `/uploads/brands/${req.file.filename}`;
    }

    const brand = await Brand.create({
      name,
      slug,
      description,
      logo: logoPath,
      website: website || "",
      status: status !== undefined ? status : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
    });

    res.status(201).json(brand);
  } catch (err) {
    // Clean up uploaded file if brand creation fails
    if (req.file) {
      deleteFile(`/uploads/brands/${req.file.filename}`);
    }
    res.status(500).json({ message: err.message });
  }
};

// Get all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single brand by ID
export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      logo,
      website,
      status,
      isFeatured,
    } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    if (slug && slug !== brand.slug) {
      const existing = await Brand.findOne({ slug });
      if (existing) {
        return res.status(409).json({ message: "Slug already exists" });
      }
      brand.slug = slug;
    }

    if (name !== undefined) brand.name = name;
    if (description !== undefined) brand.description = description;
    if (website !== undefined) brand.website = website;
    if (status !== undefined) brand.status = status;
    if (isFeatured !== undefined) brand.isFeatured = isFeatured;

    // Handle logo update (file upload or URL)
    if (req.file) {
      // Delete old logo file if it exists and is an uploaded file
      if (brand.logo) {
        deleteFile(brand.logo);
      }
      brand.logo = `/uploads/brands/${req.file.filename}`;
    } else if (logo !== undefined) {
      // If URL is provided, delete old file if it was an uploaded file
      if (brand.logo && brand.logo.startsWith("/uploads/")) {
        deleteFile(brand.logo);
      }
      brand.logo = logo;
    }

    await brand.save();
    res.json(brand);
  } catch (err) {
    // Clean up uploaded file if update fails
    if (req.file) {
      deleteFile(`/uploads/brands/${req.file.filename}`);
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete a brand
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    // Delete associated logo file if it exists
    if (brand.logo) {
      deleteFile(brand.logo);
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
