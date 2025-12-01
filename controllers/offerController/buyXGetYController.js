// controllers/offerController/buyXGetYController.js
import BuyXGetY from "../../models/offersModule/BuyXGetYModel.js";

// BuyXGetY CRUD
export const createBuyXGetY = async (req, res) => {
  try {
    const offer = new BuyXGetY(req.body);
    await offer.save();
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllBuyXGetY = async (req, res) => {
  try {
    const offers = await BuyXGetY.find();
    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyXGetYById = async (req, res) => {
  try {
    const offer = await BuyXGetY.findById(req.params.id);
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuyXGetY = async (req, res) => {
  try {
    const offer = await BuyXGetY.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBuyXGetY = async (req, res) => {
  try {
    const offer = await BuyXGetY.findByIdAndDelete(req.params.id);
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
