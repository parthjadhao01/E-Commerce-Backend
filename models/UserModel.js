import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    phone: {
      type: String,
      sparse: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roles: [
      {
        type: String,
        ref: "Role",
      },
    ],
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Virtual for password (not stored in DB)
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
  })
  .get(function () {
    return this._password;
  });

userSchema.pre("save", async function (next) {
  if (this._password) {
    this.passwordHash = await bcrypt.hash(this._password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
