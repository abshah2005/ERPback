import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      enum: [
        "Dashboard", 
        "CRM", 
        "Sales", 
        "Purchases", 
        "POS", 
        "Accounts", 
        "Inventory", 
        "Manufacturing", 
        "Reports", 
        "Setup", 
        "Payroll"
      ] 
    }
  },
  { timestamps: true }
);

export const Role = mongoose.model("Roles", RoleSchema);
