import mongoose, { Schema } from "mongoose";
const WarehouseSchema = new Schema(
  {
    name: {type:String,required:true},
    short_name: {type:String,},
    address: {type:String,required:true},
    capacity: {type:String,required:true},
    type: {type:String,required:true},
  },
  { timestamps: true }
);

export const Warehouse = mongoose.model("Warehouse", WarehouseSchema);
