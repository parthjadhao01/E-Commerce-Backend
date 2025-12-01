// controllers/offerController/loyaltyRewardController.js
import LoyaltyReward from "../../models/offersModule/LoyaltyRewardModel.js";

// LoyaltyReward CRUD
export const createLoyaltyReward = async (req, res) => {
  try {
    const loyaltyReward = new LoyaltyReward(req.body);
    await loyaltyReward.save();
    res.status(201).json({ success: true, data: loyaltyReward });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllLoyaltyRewards = async (req, res) => {
  try {
    const loyaltyRewards = await LoyaltyReward.find();
    res
      .status(200)
      .json({
        success: true,
        count: loyaltyRewards.length,
        data: loyaltyRewards,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoyaltyRewardById = async (req, res) => {
  try {
    const loyaltyReward = await LoyaltyReward.findById(req.params.id);
    if (!loyaltyReward)
      return res
        .status(404)
        .json({ success: false, message: "LoyaltyReward not found" });
    res.status(200).json({ success: true, data: loyaltyReward });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLoyaltyReward = async (req, res) => {
  try {
    const loyaltyReward = await LoyaltyReward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!loyaltyReward)
      return res
        .status(404)
        .json({ success: false, message: "LoyaltyReward not found" });
    res.status(200).json({ success: true, data: loyaltyReward });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLoyaltyReward = async (req, res) => {
  try {
    const loyaltyReward = await LoyaltyReward.findByIdAndDelete(req.params.id);
    if (!loyaltyReward)
      return res
        .status(404)
        .json({ success: false, message: "LoyaltyReward not found" });
    res.status(200).json({ success: true, message: "LoyaltyReward deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
