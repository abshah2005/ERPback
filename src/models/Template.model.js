import mongoose, { Schema } from "mongoose";

const templateSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
},{timestamps:true});

export const Templates = mongoose.model('Template', templateSchema);
