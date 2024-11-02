import { InvoiceItems } from '../models/InvoiceItems.model.js';  
import { Invoice } from '../models/Invoice.js';  
import { Apierror } from '../utils/Apierror.js';  
import { asynchandler } from '../utils/Asynchandler.js';  

const validateInvoiceItemData = (data) => {  
    const { product_id, qty, price, invoice_id } = data;  

    if (!product_id || product_id.trim() === '') {  
        throw new Apierror(400, "Product ID is required and cannot be empty.");  
    }  
    if (qty == null || qty <= 0) {  
        throw new Apierror(400, "Quantity must be greater than zero.");  
    }  
    if (price == null || price < 0) {  
        throw new Apierror(400, "Price must be a non-negative number.");  
    }  
    if (!invoice_id || invoice_id.trim() === '') {  
        throw new Apierror(400, "Invoice ID is required and cannot be empty.");  
    }  
};  

const updateInvoiceTotal = async (invoiceId) => {  
    const invoiceItems = await InvoiceItems.find({ invoice_id: invoiceId });  
    const itemsTotal = invoiceItems.reduce((total, item) => {  
        const discountAmount = (item.price * (item.discount || 0)) / 100;  
        const itemTotal = (item.price - discountAmount) * item.qty;  
        return total + itemTotal;  
    }, 0);  

    const invoice = await Invoice.findById(invoiceId);  
    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    invoice.net_amount = itemsTotal + (invoice.shipping_charges || 0) - (invoice.total_discount || 0);  
    await invoice.save();  
};  

export const addInvoiceItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const { product_id, qty, price, discount, comments, attachments } = req.body;  

    const invoice = await Invoice.findById(id);  
    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    validateInvoiceItemData(req.body);  

    const newItem = await InvoiceItems.create({   
        product_id,   
        qty,   
        price,   
        discount,   
        comments,   
        attachments,   
        invoice_id: id   
    });  

    await updateInvoiceTotal(id);  
  
    return res.status(201).json({ message: "Invoice item added successfully", item: newItem });  
});  

export const getAllInvoiceItems = asynchandler(async (req, res) => {  
    const invoiceItems = await InvoiceItems.find().populate('product_id invoice_id');  
    return res.status(200).json(invoiceItems);  
});  

export const getInvoiceItemById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoiceItem = await InvoiceItems.findById(id).populate('product_id invoice_id');  

    if (!invoiceItem) {  
        throw new Apierror(404, "Invoice item not found.");  
    }  

    return res.status(200).json(invoiceItem);  
});  

export const updateInvoiceItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  

    validateInvoiceItemData(req.body);  

    const updatedInvoiceItem = await InvoiceItems.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

    if (!updatedInvoiceItem) {  
        throw new Apierror(404, "Invoice item not found.");  
    }  

    await updateInvoiceTotal(updatedInvoiceItem.invoice_id);  

    return res.status(200).json({ message: "Invoice item updated successfully", invoiceItem: updatedInvoiceItem });  
});  

export const deleteInvoiceItem = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoiceItem = await InvoiceItems.findById(id);  

    if (!invoiceItem) {  
        throw new Apierror(404, "Invoice item not found.");  
    }  

    const deletedInvoiceItem = await InvoiceItems.findByIdAndDelete(id);  

    if (!deletedInvoiceItem) {  
        throw new Apierror(404, "Invoice item not found.");  
    }  

    // Update the related invoice total  
    await updateInvoiceTotal(invoiceItem.invoice_id);  
  
    return res.status(200).json({ message: "Invoice item deleted successfully" });  
});  

export const calculateInvoiceTotal = asynchandler(async (req, res) => {  
    const { invoice_id } = req.params;  

    const invoiceItems = await InvoiceItems.find({ invoice_id });  

    if (!invoiceItems.length) {  
        throw new Apierror(404, "No invoice items found for this invoice.");  
    }  

    const totalAmount = invoiceItems.reduce((total, item) => {  
        const discountAmount = (item.price * (item.discount || 0)) / 100;   
        const itemTotal = (item.price - discountAmount) * item.qty;  
        return total + itemTotal;  
    }, 0);  

    return res.status(200).json({ invoice_id, totalAmount });  
});