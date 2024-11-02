import mongoose,{Schema} from "mongoose";
const GoodsReceivingSchema = new Schema({  
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
    qty: { type: Number, required: true },  
    receipt_date: { type: Date },  
    description: { type: String },  
    comments: { type: String },  
    attachments: { type: [String] },
    warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }, 
    status: { type: String, default: 'PENDING' },  
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GoodsReceivingItem' }]
});

export const GoodsRecieving = mongoose.model("GoodsRecieving", GoodsReceivingSchema);