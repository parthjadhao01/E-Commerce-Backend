const mongoose = require("mongoose");
const { Schema } = mongoose;

const BusinessSettingsSchema = new Schema({
  businessName: String,
  logo: String,
  contactEmail: String,
  phone: String,
  address: String,
  gstNumber: String,
  timezone: String,
  currency: String,
});

module.exports = mongoose.model("BusinessSettings", BusinessSettingsSchema);
