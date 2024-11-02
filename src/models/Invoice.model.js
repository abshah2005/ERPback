const mongoose = require('mongoose');  

const invoiceSchema = new mongoose.Schema({  
    number: { type: String, required: true },  
    date: { type: Date, required: true },  
    receipt_date: { type: Date, required: true },  
    ref: { type: String, required: true },  
    description: { type: String, required: false },  
    comments: { type: String, required: false },  
    attachments: { type: [String], required: false },   
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },  
    status: { type: String, enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'], default: 'PENDING_APPROVAL' },  
    due_date: { type: Date, required: false },  
    total_discount: { type: Number, required: false, default: 0 },  
    shipping_charges: { type: Number, required: false, default: 0 },  
    net_amount: { type: Number, required: true },  
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }  
}, { timestamps: true });  

export const Invoice = mongoose.model('Invoice', invoiceSchema);  

