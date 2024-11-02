import mongoose, { Schema } from "mongoose";

const SalesPersonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sale_order_series_prefix: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["SALES_MAN", "ORDER_BOOKER", "DELIVERY_PERSON"],
      required: true,
    },
    receive_money_series: {
      type: String,
    },
    can_change_price: {
      type: Boolean,
      default: false,
    },
    can_add_discount: {
      type: Boolean,
      default: false,
    },
    is_manager: {
      type: Boolean,
      default: false,
    },
    line_manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPerson",
    },
    associated_cash_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", 
    },
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const SalesPerson = mongoose.model("SalesPerson", SalesPersonSchema);
