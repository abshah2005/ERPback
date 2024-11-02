import mongoose, { Schema } from "mongoose";

const CustomersSchema = new Schema(
  {
    name: { type: String, required: true },
    short_name: { type: String, required: true },
    display_name: { type: String, required: true },
    primary_email: { type: String, required: true, match: /.+\@.+\..+/ },
    secondary_email: { type: String, match: /.+\@.+\..+/ },
    ternary_email: { type: String, match: /.+\@.+\..+/ },
    phone_number: { type: String, required: true },
    secondary_phone: { type: String },
    ternary_phone: { type: String },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    lat_long: { type: [Number], index: "2dsphere" }, 
    credit_limit: { type: Number, default: 0 },
    credit_days_limit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    wh_tax: { type: Number, default: 0 },
    code: { type: String },
    profile_pic: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

CustomersSchema.index({ companyId: 1, category_id: 1 });

export const Customers = mongoose.model("Customers", CustomersSchema);
