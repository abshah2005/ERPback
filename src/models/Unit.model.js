import mongoose, { Schema } from "mongoose";

const UnitSchema = new Schema(
    {
      name:{
        type:String,
        required:true,
      },
      symbol:{
        type:String,
        required:true,
      },
      Shortname:{
        type:String,
        required:true,
      }
    },
    { timestamps: true }
  );
  
  export const Units = mongoose.model("Units", UnitSchema);