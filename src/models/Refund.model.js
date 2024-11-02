import mongoose,{Schema} from "mongoose"; 

const refundSchema = new Schema({  
    number: { type: String, required: true },  
    date: { type: Date, required: true },  
    ref: { type: String, required: true },  
    comments: { type: String, required: false },  
    attachments: { type: [String], required: false },   
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },  
    status: { type: String, enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'], default: 'PENDING_APPROVAL' }  
}, { timestamps: true });  

export const Refund = mongoose.model('Refund', refundSchema);  

