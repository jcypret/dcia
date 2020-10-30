import mongoose from "mongoose";
const { Schema } = mongoose;
import { checkPassword, hashPassword } from "../utils/auth";
import { sendPasswordResetEmail } from "../utils/email";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    accessLevel: {
      type: String,
      enum: ["instructor", "admin", "root", "revoked"],
      required: [true, "Access Level is required"],
    },
    passwordReset: {
      token: { type: String, default: null },
      expiration: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

UserSchema.methods.checkResetToken = function (token) {
  const now = new Date();
  if (now > this.passwordReset.expiration) {
    return false;
  }
  return this.passwordReset.token === token;
};
UserSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return checkPassword(password, passwordHash);
};

// Reset password, clear passwordReset token/expiry
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashed = await hashPassword(this.password);
    this.password = hashed;
    this.passwordReset.token = null;
    this.passwordReset.expiration = null;
    return next();
  } catch (err) {
    return next(err);
  }
});

// Password reset requested
UserSchema.post("save", async function (doc, next) {
  if (doc.passwordReset.token && doc.passwordReset.expiration) {
    await sendPasswordResetEmail(doc.email, doc.passwordReset.token);
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
