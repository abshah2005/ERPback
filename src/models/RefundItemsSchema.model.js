import mongoose,{Schema} from "mongoose";
const refundItemsSchema = new Schema({  
    mode: { type: String, enum: ['CASH', 'CHEQUE', 'DR', 'DD'], required: true },  
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },  
    instrument_number: { type: String, required: true },  
    bank: { type: String, required: false },  
    instrument_date: { type: Date, required: true },  
    refund_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Refund', required: true },  
    amount: { type: Number, required: true }  
}, { timestamps: true });  

export const RefundItems = mongoose.model('RefundItems', refundItemsSchema);  
