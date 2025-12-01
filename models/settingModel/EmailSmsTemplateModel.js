const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmailSmsTemplateSchema = new Schema({
  type: String, // 'order_confirm', 'reset_password'
  subject: String,
  body: String,
  channel: String, // 'email', 'sms'
});

module.exports = mongoose.model("EmailSmsTemplate", EmailSmsTemplateSchema);
