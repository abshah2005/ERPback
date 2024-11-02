import { RefundAdjustment } from "../models/RefundAdjustment.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createRefundAdjustment = asynchandler(async (req, res) => {  
  const { refundId, reason, items = [] } = req.body;  

  if (!refundId || !reason) {  
    throw new Apierror(400, "Refund ID and reason are required.");  
  }  

  const adjustment = await RefundAdjustment.create({ refundId, reason, items });  

  return res.status(201).json({ message: "Refund Adjustment created successfully", adjustment });  
});  

export const getAllRefundAdjustments = asynchandler(async (req, res) => {  
  const adjustments = await RefundAdjustment.find().populate('refundId');  
  return res.status(200).json(adjustments);  
});  

export const getRefundAdjustment = asynchandler(async (req, res) => {  
  const { adjustmentId } = req.params;  
  const adjustment = await RefundAdjustment.findById(adjustmentId).populate('refundId');  
  
  if (!adjustment) {  
    throw new Apierror(404, "Refund Adjustment not found.");  
  }  

  return res.status(200).json(adjustment);  
});  

export const updateRefundAdjustment = asynchandler(async (req, res) => {  
  const { adjustmentId } = req.params;  
  const updateFields = { ...req.body };  

  const updatedAdjustment = await RefundAdjustment.findByIdAndUpdate(adjustmentId, updateFields, { new: true, runValidators: true });  

  if (!updatedAdjustment) {  
    throw new Apierror(404, "Refund Adjustment not found.");  
  }  

  return res.status(200).json({ message: "Refund Adjustment updated successfully", adjustment: updatedAdjustment });  
});  

export const deleteRefundAdjustment = asynchandler(async (req, res) => {  
  const { adjustmentId } = req.params;  
  const deletedAdjustment = await RefundAdjustment.findByIdAndDelete(adjustmentId);  
  
  if (!deletedAdjustment) {  
    throw new Apierror(404, "Refund Adjustment not found.");  
  }  

  return res.status(200).json({ message: "Refund Adjustment deleted successfully" });  
});