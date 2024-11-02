import mongoose, { Schema } from "mongoose";

const UnderlyingUserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    profilePic: { type: String, required: true },
    associatedRole: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Roles"},
    adminId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "AdminUser" }, 
    lastLoggedIn: { type: Date },
    sessionToken: { type: String }, 
    sessionTokenExpiry: { type: Date }, 
  },
  { timestamps: true }
);

export const UnderlyingUser = mongoose.model("UnderlyingUser", UnderlyingUserSchema);
