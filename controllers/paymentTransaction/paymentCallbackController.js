import PaymentCallback from "../../models/paymentTransaction/PaymentCallbackModel.js";

// Create Payment Callback Log
async function createPaymentCallback(req, res) {
  try {
    const callback = new PaymentCallback(req.body);
    await callback.save();
    res.status(201).json(callback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all Payment Callback Logs
async function getAllPaymentCallbacks(req, res) {
  try {
    const callbacks = await PaymentCallback.find();
    res.json(callbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Payment Callback Log by ID
async function getPaymentCallbackById(req, res) {
  try {
    const callback = await PaymentCallback.findById(req.params.id);
    if (!callback) return res.status(404).json({ error: "Not found" });
    res.json(callback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Payment Callback Log
async function updatePaymentCallback(req, res) {
  try {
    const callback = await PaymentCallback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!callback) return res.status(404).json({ error: "Not found" });
    res.json(callback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete Payment Callback Log
async function deletePaymentCallback(req, res) {
  try {
    const callback = await PaymentCallback.findByIdAndDelete(req.params.id);
    if (!callback) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export default {
  createPaymentCallback,
  getAllPaymentCallbacks,
  getPaymentCallbackById,
  updatePaymentCallback,
  deletePaymentCallback,
};
