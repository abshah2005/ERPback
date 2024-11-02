import mongoose, { Schema } from "mongoose";
const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "AdminUser",
    },
    type: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    email: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    fax: { type: String, required: true },
    companyNo: { type: String, required: true },
    logo: { type: String, required: true },
    signature: { type: String, required: true },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", CompanySchema);
