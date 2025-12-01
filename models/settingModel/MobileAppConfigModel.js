const mongoose = require("mongoose");
const { Schema } = mongoose;

const MobileAppConfigSchema = new Schema({
  version: String,
  theme: Object,
  apiUrl: String,
  updatedAt: Date,
});

module.exports = mongoose.model("MobileAppConfig", MobileAppConfigSchema);
