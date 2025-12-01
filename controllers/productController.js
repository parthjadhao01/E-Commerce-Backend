import Product from "../models/product/ProductModel.js";
import Brand from "../models/product/BrandModel.js";
import Category from "../models/product/CategoryModel.js";
import fs from "fs";
import path from "path";

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (!filePath) return;

  // Remove leading slash if present to make it relative
  const relativePath = filePath.startsWith("/")
    ? filePath.substring(1)
    : filePath;

  const fullPath = path.join(process.cwd(), relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted file: ${fullPath}`);
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      brandId,
      categoryIds,
      type,
      sku,
      thumbnail,
      status,
      isFeatured,
      tags,
    } = req.body;
    if (!title || !slug || !brandId || !categoryIds || !sku || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check for unique slug and sku
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug)
      return res.status(409).json({ message: "Slug already exists" });
    const existingSku = await Product.findOne({ sku });
    if (existingSku)
      return res.status(409).json({ message: "SKU already exists" });
    // Validate brand and categories
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(400).json({ message: "Invalid brandId" });
    const categories = await Category.find({ _id: { $in: categoryIds } });
    if (categories.length !== categoryIds.length)
      return res.status(400).json({ message: "Invalid categoryIds" });

    // Handle thumbnail - either uploaded file or URL
    let thumbnailPath = thumbnail || "";
    if (req.file) {
      thumbnailPath = `/uploads/products/${req.file.filename}`;
    }

    // Create product
    const product = await Product.create({
      title,
      slug,
      description,
      brandId,
      categoryIds,
      type,
      sku,
      thumbnail: thumbnailPath,
      status,
      isFeatured,
      tags,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    // Delete uploaded file if product creation failed
    if (req.file) {
      deleteFile(`/uploads/products/${req.file.filename}`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.slug) {
      const existingSlug = await Product.findOne({
        slug: update.slug,
        _id: { $ne: id },
      });
      if (existingSlug)
        return res.status(409).json({ message: "Slug already exists" });
    }
    if (update.sku) {
      const existingSku = await Product.findOne({
        sku: update.sku,
        _id: { $ne: id },
      });
      if (existingSku)
        return res.status(409).json({ message: "SKU already exists" });
    }
    if (update.brandId) {
      const brand = await Brand.findById(update.brandId);
      if (!brand) return res.status(400).json({ message: "Invalid brandId" });
    }
    if (update.categoryIds) {
      const categories = await Category.find({
        _id: { $in: update.categoryIds },
      });
      if (categories.length !== update.categoryIds.length)
        return res.status(400).json({ message: "Invalid categoryIds" });
    }

    // Get existing product to handle file replacement
    const existingProduct = await Product.findById(id);
    if (!existingProduct)
      return res.status(404).json({ message: "Product not found" });

    // Handle thumbnail file upload
    if (req.file) {
      // Delete old thumbnail if it's a file path
      if (
        existingProduct.thumbnail &&
        existingProduct.thumbnail.startsWith("/uploads")
      ) {
        deleteFile(existingProduct.thumbnail);
      }
      // Set new file path
      update.thumbnail = `/uploads/products/${req.file.filename}`;
    } else if (update.thumbnail) {
      // If switching from file to URL, delete the old file
      if (
        existingProduct.thumbnail &&
        existingProduct.thumbnail.startsWith("/uploads")
      ) {
        deleteFile(existingProduct.thumbnail);
      }
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    // Delete uploaded file if update failed
    if (req.file) {
      deleteFile(`/uploads/products/${req.file.filename}`);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete thumbnail file if it exists
    if (product.thumbnail && product.thumbnail.startsWith("/uploads")) {
      deleteFile(product.thumbnail);
    }

    await Product.findByIdAndDelete(id);
    // Optionally: delete related data (variants, gallery, etc.)
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("brandId", "name slug")
      .populate("categoryIds", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all products (with optional filters)
export const getProducts = async (req, res) => {
  try {
    const { brandId, categoryId, status, isFeatured, type, q } = req.query;
    const filter = {};
    if (brandId) filter.brandId = brandId;
    if (categoryId) filter.categoryIds = categoryId;
    if (status !== undefined) filter.status = status === "true";
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (type) filter.type = type;
    if (q) filter.$text = { $search: q };
    const products = await Product.find(filter)
      .populate("brandId", "name slug")
      .populate("categoryIds", "name slug");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
