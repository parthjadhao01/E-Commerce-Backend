const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeoManagerSchema = new Schema({
  page: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  canonicalUrl: String,
});

module.exports = mongoose.model("SeoManager", SeoManagerSchema);
