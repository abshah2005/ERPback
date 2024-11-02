import mongoose, { Schema } from "mongoose";

const CategoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["Customer", "Vendor", "Product", "Others"],
      required: true,
    },
  },
  { timestamps: true }
);

CategoriesSchema.index({ companyId: 1, type: 1 });

export const Categories = mongoose.model("Categories", CategoriesSchema);
