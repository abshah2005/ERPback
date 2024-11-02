import mongoose,{Schema} from "mongoose";
const refundAdjustmentItemsSchema = new Schema({  
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },  
    document_number: { type: String, required: true },  
    description: { type: String, required: false },  
    attachments: { type: [String], required: false },   
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },  
    amount: { type: Number, required: true }  
}, { timestamps: true });  

export const RefundAdjustmentItems = mongoose.model('RefundAdjustmentItems', refundAdjustmentItemsSchema);  
