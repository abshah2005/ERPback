import { PurchaseOrder } from "../models/PurchaseOrder.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createPurchaseOrder = asynchandler(async (req, res) => {  
  const {  
    number,  
    date,  
    receipt_date,  
    ref,  
    description,  
    comments,  
    attachments,  
    discount_percent,  
    vendor_id,  
    total_amount,  
  } = req.body;  

  if (!number || !date || !receipt_date || !description || !vendor_id || total_amount == null) {  
    throw new Apierror(400, "All required fields must be provided.");  
  }  

  const existingOrder = await PurchaseOrder.findOne({ number });  
  if (existingOrder) {  
    throw new Apierror(400, "A purchase order with this number already exists.");  
  }  

  const newPurchaseOrder = await PurchaseOrder.create({  
    number,  
    date,  
    receipt_date,  
    ref,  
    description,  
    comments,  
    attachments,  
    discount_percent,  
    vendor_id,  
    total_amount,  
  });  

  return res.status(201).json({ message: "Purchase order created successfully", purchaseOrder: newPurchaseOrder });  
});  

export const getAllPurchaseOrders = asynchandler(async (req, res) => {  
  const purchaseOrders = await PurchaseOrder.find().populate("vendor_id");  
  return res.status(200).json(purchaseOrders);  
});  

export const getPurchaseOrderById = asynchandler(async (req, res) => {  
  const { purchaseOrderId } = req.params;  
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId).populate("vendor_id");  

  if (!purchaseOrder) {  
    throw new Apierror(404, "Purchase order not found.");  
  }  

  return res.status(200).json(purchaseOrder);  
});  


export const updatePurchaseOrder = asynchandler(async (req, res) => {  
  const { purchaseOrderId } = req.params;  

  const existingOrder = await PurchaseOrder.findById(purchaseOrderId);  
  if (!existingOrder) {  
    throw new Apierror(404, "Purchase order not found.");  
  }  

  const updateFields = {};  

  // Validate and assign fields  
  if (req.body.number) updateFields.number = req.body.number;  
  if (req.body.date) updateFields.date = req.body.date;  
  if (req.body.receipt_date) updateFields.receipt_date = req.body.receipt_date;  
  if (req.body.ref) updateFields.ref = req.body.ref;  
  if (req.body.description) updateFields.description = req.body.description;  
  if (req.body.comments) updateFields.comments = req.body.comments;  
  if (req.body.attachments) updateFields.attachments = req.body.attachments;  
  if (req.body.discount_percent != null) updateFields.discount_percent = req.body.discount_percent;  
  if (req.body.vendor_id) updateFields.vendor_id = req.body.vendor_id;  
  if (req.body.total_amount != null) updateFields.total_amount = req.body.total_amount;  

  const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, updateFields, {  
    new: true,  
    runValidators: true,  
  });  

  return res.status(200).json({ message: "Purchase order updated successfully", purchaseOrder: updatedPurchaseOrder });  
});  


export const deletePurchaseOrder = asynchandler(async (req, res) => {  
  const { purchaseOrderId } = req.params;  

  const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(purchaseOrderId);  
  if (!deletedPurchaseOrder) {  
    throw new Apierror(404, "Purchase order not found.");  
  }  

  return res.status(200).json({ message: "Purchase order deleted successfully." });  
});