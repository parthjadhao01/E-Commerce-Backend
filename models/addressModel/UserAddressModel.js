import mongoose from "mongoose";

const UserAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["home", "office"],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const UserAddress = mongoose.model("UserAddress", UserAddressSchema);
export default UserAddress;
