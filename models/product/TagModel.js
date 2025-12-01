import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: false }
);

TagSchema.index({ slug: 1 });
TagSchema.index({ name: 1 });

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
