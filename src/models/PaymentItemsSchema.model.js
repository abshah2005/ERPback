const paymentItemsSchema = new mongoose.Schema({  
    mode: { type: String, enum: ['CASH', 'CHEQUE', 'DR', 'DD'], required: true },  
    account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },  
    document_number: { type: String, required: true },  
    discount: { type: Number, required: false, default: 0 },  
    comments: { type: String, required: false },  
    attachments: { type: [String], required: false },   
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },  
    amount: { type: Number, required: true },  
}, { timestamps: true });  

export const PaymentItems = mongoose.model('PaymentItems', paymentItemsSchema);  
