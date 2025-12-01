const mongoose = require("mongoose");
const { Schema } = mongoose;

const RegionalTaxSchema = new Schema({
  region: String,
  country: String,
  state: String,
  taxRate: Number,
  gstCode: String,
});

module.exports = mongoose.model("RegionalTax", RegionalTaxSchema);
