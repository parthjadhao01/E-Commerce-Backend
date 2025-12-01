// controllers/offerController/flashSaleController.js
import FlashSale from "../../models/offersModule/FlashSaleModel.js";
import Product from "../../models/product/ProductModel.js";
import ProductVariant from "../../models/product/ProductVariantModel.js";

// FlashSale CRUD
export const createFlashSale = async (req, res) => {
  try {
    const { products } = req.body;

    // Validate all product references exist
    if (products && products.length > 0) {
      for (const item of products) {
        // Check if product exists
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Check if variant exists (if provided)
        if (item.variantId) {
          const variantExists = await ProductVariant.findById(item.variantId);
          if (!variantExists) {
            return res.status(400).json({
              success: false,
              message: `Variant with ID ${item.variantId} not found`,
            });
          }

          // Verify variant belongs to the product
          if (
            variantExists.productId.toString() !== item.productId.toString()
          ) {
            return res.status(400).json({
              success: false,
              message: `Variant ${item.variantId} does not belong to product ${item.productId}`,
            });
          }
        }
      }
    }

    const flashSale = new FlashSale(req.body);
    await flashSale.save();
    res.status(201).json({ success: true, data: flashSale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllFlashSales = async (req, res) => {
  try {
    const flashSales = await FlashSale.find()
      .populate("products.productId", "title name price")
      .populate("products.variantId", "variantName price");
    res
      .status(200)
      .json({ success: true, count: flashSales.length, data: flashSales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFlashSaleById = async (req, res) => {
  try {
    const flashSale = await FlashSale.findById(req.params.id)
      .populate("products.productId", "title name price")
      .populate("products.variantId", "variantName price");
    if (!flashSale)
      return res
        .status(404)
        .json({ success: false, message: "FlashSale not found" });
    res.status(200).json({ success: true, data: flashSale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFlashSale = async (req, res) => {
  try {
    const { products } = req.body;

    // Validate all product references exist (if products are being updated)
    if (products && products.length > 0) {
      for (const item of products) {
        // Check if product exists
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Check if variant exists (if provided)
        if (item.variantId) {
          const variantExists = await ProductVariant.findById(item.variantId);
          if (!variantExists) {
            return res.status(400).json({
              success: false,
              message: `Variant with ID ${item.variantId} not found`,
            });
          }

          // Verify variant belongs to the product
          if (
            variantExists.productId.toString() !== item.productId.toString()
          ) {
            return res.status(400).json({
              success: false,
              message: `Variant ${item.variantId} does not belong to product ${item.productId}`,
            });
          }
        }
      }
    }

    const flashSale = await FlashSale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!flashSale)
      return res
        .status(404)
        .json({ success: false, message: "FlashSale not found" });
    res.status(200).json({ success: true, data: flashSale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFlashSale = async (req, res) => {
  try {
    const flashSale = await FlashSale.findByIdAndDelete(req.params.id);
    if (!flashSale)
      return res
        .status(404)
        .json({ success: false, message: "FlashSale not found" });
    res.status(200).json({ success: true, message: "FlashSale deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
