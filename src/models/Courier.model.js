import mongoose, { Schema } from "mongoose";

const CourierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    short_name: {
      type: String,
      trim: true,
    },
    display_name: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    secondary_phone: {
      type: String,
      trim: true,
    },
    ternary_phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    profile_pic: {
      type: String, 
    },
    attachments: [
      {
        type: String,
      },
    ],
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const Courier = mongoose.model("Courier", CourierSchema);
