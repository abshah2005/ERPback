import mongoose,{Schema} from "mongoose"; 

const paymentAdjustmentItemsSchema = new mongoose.Schema({  
    account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },  
    document_number: { type: String, required: true },  
    description: { type: String, required: false },  
    attachments: { type: [String], required: false },   
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },  
    amount: { type: Number, required: true }  
}, { timestamps: true });  

export const PaymentAdjustmentItems = mongoose.model('PaymentAdjustmentItems', paymentAdjustmentItemsSchema);  
