import UserAddress from "../models/addressModel/UserAddressModel.js";

// Create a new address
export const createAddress = async (req, res) => {
  try {
    const address = new UserAddress(req.body);
    await address.save();
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    const addresses = await UserAddress.find({ userId });
    res
      .status(200)
      .json({ success: true, count: addresses.length, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const address = await UserAddress.findById(req.params.id);
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const address = await UserAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await UserAddress.findByIdAndDelete(req.params.id);
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
