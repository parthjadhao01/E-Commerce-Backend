import PaymentTransaction from "../models/paymentTransaction/PaymentTransactionModel.js";

// Create a new payment transaction
export const createPaymentTransaction = async (req, res) => {
  try {
    const transaction = new PaymentTransaction(req.body);
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payment transactions (admin or user)
export const getAllPaymentTransactions = async (req, res) => {
  try {
    const { userId, orderId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (orderId) filter.orderId = orderId;
    const transactions = await PaymentTransaction.find(filter);
    res
      .status(200)
      .json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment transaction by ID
export const getPaymentTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findById(req.params.id);
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment transaction status or response (admin/gateway only)
export const updatePaymentTransaction = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete payment transaction (admin only, rarely used)
export const deletePaymentTransaction = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findByIdAndDelete(
      req.params.id
    );
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
