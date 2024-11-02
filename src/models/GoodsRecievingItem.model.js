import mongoose,{Schema} from "mongoose";
const GoodsReceivingItemSchema = new Schema({  
    product_id: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    qty: { type: Number, required: true },  
    description: { type: String },  
    comments: { type: String },  
    attachments: { type: [String] }, 
    warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }, 
}); 

export const GoodsReceivingItem=mongoose.model("GoodRecievingItem",GoodsReceivingItemSchema)