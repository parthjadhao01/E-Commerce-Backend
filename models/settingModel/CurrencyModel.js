const mongoose = require("mongoose");
const { Schema } = mongoose;

const CurrencySchema = new Schema({
  code: String, // 'INR', 'USD'
  symbol: String,
  exchangeRate: Number,
  isDefault: Boolean,
});

module.exports = mongoose.model("Currency", CurrencySchema);
