import { Refund } from "../models/Refund.model.js";  
import { RefundItems } from "../models/RefundItemsSchema.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  
import {Vendors} from "../models/Vendor.model.js"

const calculateTotalAmount = async (refundId) => {  
  const items = await RefundItems.find({ refund_id: refundId });  
  return items.reduce((total, item) => total + item.amount, 0);  
};  

export const createRefund = asynchandler(async (req, res) => {  
  const { number, date, ref, comments, attachments, vendor_id } = req.body;  

  if (!number || !date || !ref || !vendor_id) {  
    throw new Apierror(400, "Number, date, ref, and vendor ID are required.");  
  }  
  const vendorExists=await Vendors.findById(vendor_id);
  if(!vendorExists){
    throw new Apierror(400,"Vendor not found")
  }
  const refund = await Refund.create({ number, date, ref, comments, attachments, vendor_id });  
  return res.status(201).json({ message: "Refund created successfully", refund });  
});  

export const getAllRefunds = asynchandler(async (req, res) => {  
  const refunds = await Refund.find().populate('vendor_id');  
  return res.status(200).json(refunds);  
});  

export const getRefund = asynchandler(async (req, res) => {  
  const { refundId } = req.params;  
  const refund = await Refund.findById(refundId).populate('vendor_id');  

  if (!refund) {  
    throw new Apierror(404, "Refund not found.");  
  }  

  return res.status(200).json(refund);  
});  

export const updateRefund = asynchandler(async (req, res) => {  
  const { refundId } = req.params;  
  const updateFields = { ...req.body };  

  const updatedRefund = await Refund.findByIdAndUpdate(refundId, updateFields, { new: true, runValidators: true });  

  if (!updatedRefund) {  
    throw new Apierror(404, "Refund not found.");  
  }  

  const totalAmount = await calculateTotalAmount(refundId);  
  updatedRefund.totalAmount = totalAmount; 
  await updatedRefund.save();  

  return res.status(200).json({ message: "Refund updated successfully", refund: updatedRefund });  
});  

export const deleteRefund = asynchandler(async (req, res) => {  
  const { refundId } = req.params;  
  const deletedRefund = await Refund.findByIdAndDelete(refundId);  
  
  if (!deletedRefund) {  
    throw new Apierror(404, "Refund not found.");  
  }  

  // Optionally, delete associated refund items  
  await RefundItems.deleteMany({ refund_id: refundId });  

  return res.status(200).json({ message: "Refund deleted successfully" });  
});