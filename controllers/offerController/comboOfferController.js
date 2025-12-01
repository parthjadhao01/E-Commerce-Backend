// controllers/offerController/comboOfferController.js
import ComboOffer from "../../models/offersModule/ComboOfferModel.js";
import Product from "../../models/product/ProductModel.js";

// ComboOffer CRUD
export const createComboOffer = async (req, res) => {
  try {
    const { items } = req.body;

    // Validate all product references exist
    if (items && items.length > 0) {
      for (const item of items) {
        // Check if product exists
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Validate quantity
        if (item.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: `Quantity must be greater than 0 for product ${item.productId}`,
          });
        }
      }
    }

    const comboOffer = new ComboOffer(req.body);
    await comboOffer.save();
    res.status(201).json({ success: true, data: comboOffer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllComboOffers = async (req, res) => {
  try {
    const comboOffers = await ComboOffer.find().populate(
      "items.productId",
      "title name price"
    );
    res
      .status(200)
      .json({ success: true, count: comboOffers.length, data: comboOffers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComboOfferById = async (req, res) => {
  try {
    const comboOffer = await ComboOffer.findById(req.params.id).populate(
      "items.productId",
      "title name price"
    );
    if (!comboOffer)
      return res
        .status(404)
        .json({ success: false, message: "ComboOffer not found" });
    res.status(200).json({ success: true, data: comboOffer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComboOffer = async (req, res) => {
  try {
    const { items } = req.body;

    // Validate all product references exist (if items are being updated)
    if (items && items.length > 0) {
      for (const item of items) {
        // Check if product exists
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Validate quantity
        if (item.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: `Quantity must be greater than 0 for product ${item.productId}`,
          });
        }
      }
    }

    const comboOffer = await ComboOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!comboOffer)
      return res
        .status(404)
        .json({ success: false, message: "ComboOffer not found" });
    res.status(200).json({ success: true, data: comboOffer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteComboOffer = async (req, res) => {
  try {
    const comboOffer = await ComboOffer.findByIdAndDelete(req.params.id);
    if (!comboOffer)
      return res
        .status(404)
        .json({ success: false, message: "ComboOffer not found" });
    res.status(200).json({ success: true, message: "ComboOffer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
