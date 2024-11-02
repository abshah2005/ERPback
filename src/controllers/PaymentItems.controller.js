import { PaymentItems } from "../models/PaymentItemsSchema.model.js";  
import { Payment } from "../models/PaymentSchema.model.js";   
import { Account } from "../models/Account.model.js"; 
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createPaymentItem = asynchandler(async (req, res) => {  
    const { mode, account_id, document_number, amount, payment_id } = req.body;  

    if (!mode || !account_id || !document_number || !amount || !payment_id) {  
        throw new Apierror(400, "Mode, account ID, document number, amount, and payment ID are required.");  
    }  

    const accountExists = await Account.findById(account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Account not found.");  
    }  

    const paymentExists = await Payment.findById(payment_id);  
    if (!paymentExists) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    const newPaymentItem = await PaymentItems.create(req.body);  
    return res.status(201).json({ message: "Payment Item created successfully", paymentItem: newPaymentItem });  
});  


export const getPaymentItems = asynchandler(async (req, res) => {  
    const paymentItems = await PaymentItems.find().populate('account_id payment_id');  
    return res.status(200).json(paymentItems);  
});  


export const getPaymentItemById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const paymentItem = await PaymentItems.findById(id).populate('account_id payment_id');  

    if (!paymentItem) {  
        throw new Apierror(404, "Payment Item not found.");  
    }  

    return res.status(200).json(paymentItem);  
});  

export const updatePaymentItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const { mode, account_id, document_number, amount, payment_id } = req.body;  

    if (!mode || !account_id || !document_number || !amount || !payment_id) {  
        throw new Apierror(400, "Mode, account ID, document number, amount, and payment ID are required.");  
    }  

    const accountExists = await Account.findById(account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Account not found.");  
    }  

    const paymentExists = await Payment.findById(payment_id);  
    if (!paymentExists) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    const updatedPaymentItem = await PaymentItems.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

    if (!updatedPaymentItem) {  
        throw new Apierror(404, "Payment Item not found.");  
    }  

    return res.status(200).json({ message: "Payment Item updated successfully", paymentItem: updatedPaymentItem });  
});  

export const deletePaymentItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const deletedPaymentItem = await PaymentItems.findByIdAndDelete(id);  

    if (!deletedPaymentItem) {  
        throw new Apierror(404, "Payment Item not found.");  
    }  

    return res.status(200).json({ message: "Payment Item deleted successfully" });  
});