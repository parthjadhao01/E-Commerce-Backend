// controllers/userController.js
import Product from "../models/product/ProductModel.js";

// @desc    Get all products (user-facing)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate(
        "brand category attributes variants gallery tags faqs seo pricing taxRule"
      )
      .lean();
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export default {
  getAllProducts,
};
