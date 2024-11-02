const mongoose = require('mongoose');  

const paymentSchema = new mongoose.Schema({  
    number: { type: String, required: true },  
    date: { type: Date, required: true },  
    ref: { type: String, required: true },  
    comments: { type: String, required: false },  
    attachments: { type: [String], required: false },    
    vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },  
    status: { type: String, enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'], default: 'PENDING_APPROVAL' },  
    // paymentItems: [{ type: Schema.Types.ObjectId, ref: 'PaymentItems' }]
}, { timestamps: true });  

export const Payment = mongoose.model('Payment', paymentSchema);  
