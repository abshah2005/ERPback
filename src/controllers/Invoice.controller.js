import { Invoice } from '../models/Invoice.js';  
import { InvoiceItems } from '../models/InvoiceItems.model.js';  
import { Vendor } from '../models/Vendor.js'; // Assuming you have a Vendor model  
import { Account } from '../models/Account.js'; // Assuming you have an Account model  
import { Apierror } from '../utils/Apierror.js';  
import { asynchandler } from '../utils/Asynchandler.js';  

export const createInvoice = asynchandler(async (req, res) => {  
    const { number, date, receipt_date, ref, vendor_id, net_amount, account_id, ...rest } = req.body;  

    if (!number || !date || !receipt_date || !ref || !vendor_id || !net_amount || !account_id) {  
        throw new Apierror(400, "All fields are required.");  
    }  
    
    // Check if vendor exists  
    const vendorExists = await Vendor.findById(vendor_id);  
    if (!vendorExists) {  
        throw new Apierror(404, "Vendor not found.");  
    }  

    // Check if account exists  
    const accountExists = await Account.findById(account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Account not found.");  
    }  
  
    const newInvoice = await Invoice.create({ number, date, receipt_date, ref, vendor_id, net_amount, account_id, ...rest });  
    
    return res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });  
});  

export const getAllInvoices = asynchandler(async (req, res) => {  
    const invoices = await Invoice.find().populate('vendor_id account_id');  
    return res.status(200).json(invoices);  
});  

export const getInvoiceById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoice = await Invoice.findById(id).populate('vendor_id account_id');  

    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    return res.status(200).json(invoice);  
});  

export const updateInvoice = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

    if (!updatedInvoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    return res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });  
});  

export const deleteInvoice = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const deletedInvoice = await Invoice.findByIdAndDelete(id);  

    if (!deletedInvoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    await InvoiceItems.deleteMany({ invoice_id: id });  
    
    return res.status(200).json({ message: "Invoice deleted successfully" });  
});  

export const approveInvoice = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoice = await Invoice.findByIdAndUpdate(id, { status: 'APPROVED' }, { new: true });  

    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    return res.status(200).json(invoice);  
});  

export const rejectInvoice = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoice = await Invoice.findByIdAndUpdate(id, { status: 'REJECTED' }, { new: true });  

    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    return res.status(200).json(invoice);  
});  

export const getAllInvoicesWithNetAmount = asynchandler(async (req, res) => {  
    // Fetch all invoices and populate vendor and account details  
    const invoices = await Invoice.find().populate('vendor_id account_id');  

    // Map through each invoice to include associated items  
    const invoicesWithDetails = await Promise.all(invoices.map(async (invoice) => {  
        // Fetch associated invoice items  
        const invoiceItems = await InvoiceItems.find({ invoice_id: invoice._id }).populate('product_id');  

        // Return a new invoice object with required details  
        return {  
            ...invoice.toObject(),  
            items: invoiceItems,  
            itemsTotal: invoiceItems.length > 0 ? invoiceItems.reduce((total, item) => {  
                const discountAmount = (item.price * (item.discount || 0)) / 100;  
                const itemTotal = (item.price - discountAmount) * item.qty;  
                return total + itemTotal;  
            }, 0) : 0,  
            netAmount: invoice.net_amount // Directly use net_amount from the invoice  
        };  
    }));  

    // Return the aggregated invoices with items and totals  
    return res.status(200).json(invoicesWithDetails);  
});  

// Get the total amount for a specific invoice  
export const getInvoiceTotalById = asynchandler(async (req, res) => {  
    const { id } = req.params;  

    const invoice = await Invoice.findById(id);  

    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    return res.status(200).json({ invoice_id: id, totalAmount: invoice.net_amount });  
});  

export const getInvoiceWithItemsById = asynchandler(async (req, res) => {  
    const { id } = req.params;  
    const invoice = await Invoice.findById(id).populate('vendor_id account_id');  

    if (!invoice) {  
        throw new Apierror(404, "Invoice not found.");  
    }  

    // Check if vendor exists  
    const vendorExists = await Vendor.findById(invoice.vendor_id);  
    if (!vendorExists) {  
        throw new Apierror(404, "Associated vendor not found.");  
    }  

    // Check if account exists  
    const accountExists = await Account.findById(invoice.account_id);  
    if (!accountExists) {  
        throw new Apierror(404, "Associated account not found.");  
    }  

    const invoiceItems = await InvoiceItems.find({ invoice_id: id }).populate('product_id');  

    return res.status(200).json({  
        invoice,  
        items: invoiceItems,  
        itemsTotal: invoiceItems.length > 0 ? invoiceItems.reduce((total, item) => {  
            const discountAmount = (item.price * (item.discount || 0)) / 100;   
            const itemTotal = (item.price - discountAmount) * item.qty;  
            return total + itemTotal;  
        }, 0) : 0,  
        netAmount: invoice.net_amount // Return net_amount directly from the invoice  
    });  
});