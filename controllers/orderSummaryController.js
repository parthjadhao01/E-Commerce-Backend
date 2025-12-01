import OrderSummary from "../models/orderSummaryModel/OrderSummaryModel.js";

// Create order summary
export const createOrderSummary = async (req, res) => {
  try {
    const summary = new OrderSummary(req.body);
    await summary.save();
    res.status(201).json({ success: true, data: summary });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all order summaries (admin or for user)
export const getAllOrderSummaries = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const summaries = await OrderSummary.find(filter);
    res
      .status(200)
      .json({ success: true, count: summaries.length, data: summaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order summary by ID
export const getOrderSummaryById = async (req, res) => {
  try {
    const summary = await OrderSummary.findById(req.params.id);
    if (!summary)
      return res
        .status(404)
        .json({ success: false, message: "Order summary not found" });
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order summary
export const updateOrderSummary = async (req, res) => {
  try {
    const summary = await OrderSummary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!summary)
      return res
        .status(404)
        .json({ success: false, message: "Order summary not found" });
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete order summary
export const deleteOrderSummary = async (req, res) => {
  try {
    const summary = await OrderSummary.findByIdAndDelete(req.params.id);
    if (!summary)
      return res
        .status(404)
        .json({ success: false, message: "Order summary not found" });
    res.status(200).json({ success: true, message: "Order summary deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
