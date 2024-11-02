import { PaymentAdjustmentItems } from "../models/PaymentItemsSchema.model.js";  
import { Payment } from "../models/PaymentSchema.model.js";   
import { Account } from "../models/Account.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createPaymentAdjustmentItem = asynchandler(async (req, res) => {  
    const { account_id, document_number, payment_id, amount } = req.body;  

    if (!account_id || !document_number || !payment_id || !amount) {  
        throw new Apierror(400, "Account ID, document number, payment ID, and amount are required.");  
    }  

    const accountExists = await Account.findById(account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Account not found.");  
    }  

    const paymentExists = await Payment.findById(payment_id);  
    if (!paymentExists) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    const newPaymentAdjustmentItem = await PaymentAdjustmentItems.create(req.body);  
    return res.status(201).json({ message: "Payment Adjustment Item created successfully", paymentAdjustmentItem: newPaymentAdjustmentItem });  
});  

export const getPaymentAdjustmentItems = asynchandler(async (req, res) => {  
    const paymentAdjustmentItems = await PaymentAdjustmentItems.find().populate('account_id payment_id');  
    return res.status(200).json(paymentAdjustmentItems);  
});  

export const getPaymentAdjustmentItemById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const paymentAdjustmentItem = await PaymentAdjustmentItems.findById(id).populate('account_id payment_id');  

    if (!paymentAdjustmentItem) {  
        throw new Apierror(404, "Payment Adjustment Item not found.");  
    }  

    return res.status(200).json(paymentAdjustmentItem);  
});  

export const updatePaymentAdjustmentItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const { account_id, document_number, payment_id, amount } = req.body;  

    if (!account_id || !document_number || !payment_id || !amount) {  
        throw new Apierror(400, "Account ID, document number, payment ID, and amount are required.");  
    }  

    const accountExists = await Account.findById(account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Account not found.");  
    }  

    const paymentExists = await Payment.findById(payment_id);  
    if (!paymentExists) {  
        throw new Apierror(404, "Payment not found.");  
    }  

    const updatedPaymentAdjustmentItem = await PaymentAdjustmentItems.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

    if (!updatedPaymentAdjustmentItem) {  
        throw new Apierror(404, "Payment Adjustment Item not found.");  
    }  

    return res.status(200).json({ message: "Payment Adjustment Item updated successfully", paymentAdjustmentItem: updatedPaymentAdjustmentItem });  
});  

export const deletePaymentAdjustmentItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const deletedPaymentAdjustmentItem = await PaymentAdjustmentItems.findByIdAndDelete(id);  

    if (!deletedPaymentAdjustmentItem) {  
        throw new Apierror(404, "Payment Adjustment Item not found.");  
    }  

    return res.status(200).json({ message: "Payment Adjustment Item deleted successfully" });  
});