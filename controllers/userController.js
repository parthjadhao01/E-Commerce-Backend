// controllers/userController.js
import Product from "../models/product/ProductModel.js";
import Category from "../models/product/CategoryModel.js";

// @desc    Get all products (user-facing)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate()
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

const getAllCategories = async (req,res) => {
    try {
        const categories = await Category.find().populate().lean();
        res.status(200).json({success : true, categories : categories});
    }catch (error){
        console.log(error);
        res.status(500).json({success : false, message : "Server Error",error})
    }
}

export default {
  getAllProducts,
    getAllCategories
};
