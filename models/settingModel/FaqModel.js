const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqSchema = new Schema({
  category: String,
  question: String,
  answer: String,
  status: Boolean,
});

module.exports = mongoose.model("Faq", FaqSchema);
