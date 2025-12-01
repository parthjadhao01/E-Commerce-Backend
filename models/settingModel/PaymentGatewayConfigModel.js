const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentGatewayConfigSchema = new Schema({
  name: String,
  config: Object,
  status: Boolean,
});

module.exports = mongoose.model(
  "PaymentGatewayConfig",
  PaymentGatewayConfigSchema
);
