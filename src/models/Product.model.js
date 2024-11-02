import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    unit_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Units", 
      required: true 
    }, 
    CompanyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Company", 
      required: true 
    }, 
    is_fractional: { type: Boolean, default: false }, 
    manage_batch: { type: Boolean, default: false }, 
    custom_serial_number: { type: Boolean, default: false },
    inventory_account: { type: String }, 
    purchase_price: { type: Number, required: true }, 
    purchase_account_id: { type: String },     purchase_discount_account: { type: String }, 
    sale_price: { type: Number, required: true }, 
    sale_account_id: { type: String }, 
    sale_discounts_account_id: { type: String }, 
    max_retail_price: { type: Number }, 
  },
  { timestamps: true }
);

export const Products = mongoose.model("Products", ProductSchema);
