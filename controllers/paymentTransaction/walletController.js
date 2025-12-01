import Wallet from "../../models/paymentTransaction/WalletModel.js";

// Create Wallet
async function createWallet(req, res) {
  try {
    const wallet = new Wallet(req.body);
    await wallet.save();
    res.status(201).json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all Wallets
async function getAllWallets(req, res) {
  try {
    const wallets = await Wallet.find();
    res.json(wallets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Wallet by ID
async function getWalletById(req, res) {
  try {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(404).json({ error: "Not found" });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Wallet
async function updateWallet(req, res) {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!wallet) return res.status(404).json({ error: "Not found" });
    res.json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete Wallet
async function deleteWallet(req, res) {
  try {
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export default {
  createWallet,
  getAllWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
};
