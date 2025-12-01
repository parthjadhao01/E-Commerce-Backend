// controllers/offerController/autoDiscountController.js
import AutoDiscount from '../../models/offersModule/AutoDiscountModel.js';

// AutoDiscount CRUD
export const createAutoDiscount = async (req, res) => {
  try {
    const autoDiscount = new AutoDiscount(req.body);
    await autoDiscount.save();
    res.status(201).json({ success: true, data: autoDiscount });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllAutoDiscounts = async (req, res) => {
  try {
    const autoDiscounts = await AutoDiscount.find();
    res.status(200).json({ success: true, count: autoDiscounts.length, data: autoDiscounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAutoDiscountById = async (req, res) => {
  try {
    const autoDiscount = await AutoDiscount.findById(req.params.id);
    if (!autoDiscount) return res.status(404).json({ success: false, message: 'AutoDiscount not found' });
    res.status(200).json({ success: true, data: autoDiscount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAutoDiscount = async (req, res) => {
  try {
    const autoDiscount = await AutoDiscount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!autoDiscount) return res.status(404).json({ success: false, message: 'AutoDiscount not found' });
    res.status(200).json({ success: true, data: autoDiscount });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAutoDiscount = async (req, res) => {
  try {
    const autoDiscount = await AutoDiscount.findByIdAndDelete(req.params.id);
    if (!autoDiscount) return res.status(404).json({ success: false, message: 'AutoDiscount not found' });
    res.status(200).json({ success: true, message: 'AutoDiscount deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
