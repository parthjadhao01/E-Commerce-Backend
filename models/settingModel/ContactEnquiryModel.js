const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactEnquirySchema = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status: String, // 'new', 'resolved'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContactEnquiry", ContactEnquirySchema);
