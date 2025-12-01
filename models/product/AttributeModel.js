import mongoose from "mongoose";

const AttributeValueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "number", "select", "multiselect"],
      required: true,
      default: "text",
    },
    values: {
      type: [AttributeValueSchema],
      default: [],
    },
    isFilter: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast filtering
AttributeSchema.index({ slug: 1 });
AttributeSchema.index({ isFilter: 1 });

const Attribute = mongoose.model("Attribute", AttributeSchema);
export default Attribute;
