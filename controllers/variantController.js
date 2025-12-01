import ProductVariant from "../models/product/ProductVariantModel.js";

// Create a new product variant
export const createVariant = async (req, res) => {
  try {
    const {
      productId,
      sku,
      attributes,
      price,
      compareAtPrice,
      stock,
      barcode,
      status,
      image,
    } = req.body;
    if (!productId || !sku) {
      return res
        .status(400)
        .json({ message: "productId and sku are required" });
    }
    // Check for unique SKU within the same product
    const existing = await ProductVariant.findOne({ productId, sku });
    if (existing) {
      return res
        .status(409)
        .json({ message: "SKU already exists for this product" });
    }
    const variant = await ProductVariant.create({
      productId,
      sku,
      attributes,
      price,
      compareAtPrice,
      stock,
      barcode,
      status,
      image,
    });
    res.status(201).json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all variants for a product
export const getVariants = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const variants = await ProductVariant.find(filter);
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single variant by ID
export const getVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a variant
export const updateVariant = async (req, res) => {
  try {
    const {
      sku,
      attributes,
      price,
      compareAtPrice,
      stock,
      barcode,
      status,
      image,
    } = req.body;
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    if (sku && sku !== variant.sku) {
      const existing = await ProductVariant.findOne({
        productId: variant.productId,
        sku,
      });
      if (existing) {
        return res
          .status(409)
          .json({ message: "SKU already exists for this product" });
      }
      variant.sku = sku;
    }
    if (attributes) variant.attributes = attributes;
    if (price !== undefined) variant.price = price;
    if (compareAtPrice !== undefined) variant.compareAtPrice = compareAtPrice;
    if (stock !== undefined) variant.stock = stock;
    if (barcode !== undefined) variant.barcode = barcode;
    if (status !== undefined) variant.status = status;
    if (image !== undefined) variant.image = image;
    await variant.save();
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a variant
export const deleteVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    res.json({ message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
