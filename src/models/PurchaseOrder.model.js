import mongoose, { Schema } from "mongoose";

const PurchaseOrderSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    receipt_date: {
      type: Date,
      required: true,
    },
    ref: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    comments: {
      type: String,
      maxlength: 500,
      default: "",
    },
    attachments: [
      {
        type: String, // URL or file path
      },
    ],
    discount_percent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: "Vendors",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);


