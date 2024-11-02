import mongoose, { Schema } from "mongoose";

const AdminUserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    profilePic: { type: String, required: true },
    packagePlan: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    gracePeriodDays: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    sessionToken: { type: String },
    sessionTokenExpiry: { type: Date },
    lastLoggedIn: { type: Date },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
