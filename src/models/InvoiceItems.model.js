const invoiceItemsSchema = new mongoose.Schema({  
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },  
    qty: { type: Number, required: true },  
    price: { type: Number, required: true },  
    discount: { type: Number, required: false, default: 0 },  
    comments: { type: String, required: false },  
    attachments: { type: [String], required: false },    
    invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true }  
}, { timestamps: true });  

export const InvoiceItems = mongoose.model('InvoiceItems', invoiceItemsSchema);  
