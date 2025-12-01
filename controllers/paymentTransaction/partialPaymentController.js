import PartialPayment from "../../models/paymentTransaction/PartialPaymentModel.js";

// Create Partial Payment
async function createPartialPayment(req, res) {
  try {
    const partialPayment = new PartialPayment(req.body);
    await partialPayment.save();
    res.status(201).json(partialPayment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all Partial Payments
async function getAllPartialPayments(req, res) {
  try {
    const payments = await PartialPayment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Partial Payment by ID
async function getPartialPaymentById(req, res) {
  try {
    const payment = await PartialPayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Partial Payment
async function updatePartialPayment(req, res) {
  try {
    const payment = await PartialPayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: "Not found" });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete Partial Payment
async function deletePartialPayment(req, res) {
  try {
    const payment = await PartialPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export default {
  createPartialPayment,
  getAllPartialPayments,
  getPartialPaymentById,
  updatePartialPayment,
  deletePartialPayment,
};
