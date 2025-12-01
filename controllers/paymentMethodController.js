import PaymentMethod from "../models/paymentModel/PaymentMethodModel.js";

// Create a new payment method
export const createPaymentMethod = async (req, res) => {
  try {
    const method = new PaymentMethod(req.body);
    await method.save();
    res.status(201).json({ success: true, data: method });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payment methods
export const getAllPaymentMethods = async (req, res) => {
  console.log("inside")
  try {
    console.log("inside get all payment methods")
    const methods = await PaymentMethod.find();
    res
      .status(200)
      .json({ success: true, count: methods.length, data: methods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment method by ID
export const getPaymentMethodById = async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    res.status(200).json({ success: true, data: method });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!method)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    res.status(200).json({ success: true, data: method });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!method)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    res.status(200).json({ success: true, message: "Payment method deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
