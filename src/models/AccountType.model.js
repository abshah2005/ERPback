import mongoose, { Schema } from "mongoose";

const AccountTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    systemName: {
      type: String,
      trim: true,
    },
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true,
    },
  },
  { timestamps: true }
);

export const AccountType = mongoose.model("AccountType", AccountTypeSchema);