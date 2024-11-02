import { Payment } from "../models/PaymentSchema.model.js";  
import { PaymentItems } from "../models/PaymentItemsSchema.model.js";   
import { Vendors } from "../models/Vendor.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createPayment = asynchandler(async (req, res) => {  
    const { number, date, ref, comments, attachments, vendor_id } = req.body;  

    if (!number || !date || !ref || !vendor_id) {  
        throw new Apierror(400, "Number, date, reference, and vendor ID are required.");  
    }  

    const vendorExists = await Vendors.findById(vendor_id);  
    if (!vendorExists) {  
        throw new Apierror(404, "Vendor not found.");  
    }  

    const newPayment = await Payment.create(req.body);  
    return res.status(201).json({ message: "Payment created successfully", payment: newPayment });  
});  

export const getPayments = asynchandler(async (req, res) => {  
    const payments = await Payment.find().populate('vendor_id');  
    return res.status(200).json(payments);  
});  

export const getPaymentById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const payment = await Payment.findById(id).populate('vendor_id');  

    if (!payment) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    return res.status(200).json(payment);  
});  

export const updatePayment = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const { number, date, ref, vendor_id } = req.body;  

    if (!number || !date || !ref || !vendor_id) {  
        throw new Apierror(400, "Number, date, reference, and vendor ID are required.");  
    }  


    const vendorExists = await Vendors.findById(vendor_id);  
    if (!vendorExists) {  
        throw new Apierror(404, "Vendor not found.");  
    }  

    const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

    if (!updatedPayment) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    return res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });  
});  

export const deletePayment = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const deletedPayment = await Payment.findByIdAndDelete(id);  

    if (!deletedPayment) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    return res.status(200).json({ message: "Payment deleted successfully" });  
});