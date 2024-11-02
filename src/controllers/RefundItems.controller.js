import { RefundItems } from "../models/RefundItems.model.js";  
import { Refund } from "../models/Refund.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  
const calculateTotalAmount = async (refundId) => {  
  const items = await RefundItems.find({ refund_id: refundId });  
  return items.reduce((total, item) => total + item.amount, 0);  
};

export const createRefundItem = asynchandler(async (req, res) => {  
  const { mode, account_id, instrument_number, bank, instrument_date, refund_id, amount } = req.body;  

  if (!refund_id || !mode || !account_id || !instrument_number || amount <= 0) {  
    throw new Apierror(400, "Refund ID, mode, account ID, instrument number, and a valid amount are required.");  
  }  

  const refundItem = await RefundItems.create({ mode, account_id, instrument_number, bank, instrument_date, refund_id, amount });  
  const refundExists=await Refund.findById(refund_id);
  if(!refundExists){
    throw new Apierror(400,"Refund dont exist")
  }
  const totalAmount = await calculateTotalAmount(refund_id);  
  const refund = await Refund.findById(refund_id);  
  refund.totalAmount = totalAmount;  
  await refund.save();  

  return res.status(201).json({ message: "Refund Item created successfully", refundItem });  
});  

export const getAllRefundItems = asynchandler(async (req, res) => {  
  const refundItems = await RefundItems.find().populate('refund_id');  
  return res.status(200).json(refundItems);  
});  

export const getRefundItem = asynchandler(async (req, res) => {  
  const { itemId } = req.params;  
  const refundItem = await RefundItems.findById(itemId).populate('refund_id');  

  if (!refundItem) {  
    throw new Apierror(404, "Refund Item not found.");  
  }  

  return res.status(200).json(refundItem);  
});  

export const updateRefundItem = asynchandler(async (req, res) => {  
  const { itemId } = req.params;  
  const updateFields = { ...req.body };  

  const updatedItem = await RefundItems.findByIdAndUpdate(itemId, updateFields, { new: true, runValidators: true });  

  if (!updatedItem) {  
    throw new Apierror(404, "Refund Item not found.");  
  }  
  
  const totalAmount = await calculateTotalAmount(updatedItem.refund_id);  
  const refund = await Refund.findById(updatedItem.refund_id);  
  refund.totalAmount = totalAmount; 
  await refund.save();  

  return res.status(200).json({ message: "Refund Item updated successfully", refundItem: updatedItem });  
});  

export const deleteRefundItem = asynchandler(async (req, res) => {  
  const { itemId } = req.params;  
  const refundItem = await RefundItems.findById(itemId);  

  if (!refundItem) {  
    throw new Apierror(404, "Refund Item not found.");  
  }  

  const refundId = refundItem.refund_id; 
  await RefundItems.findByIdAndDelete(itemId);  

  const totalAmount = await calculateTotalAmount(refundId);  
  const refund = await Refund.findById(refundId);  
  refund.totalAmount = totalAmount; 
  await refund.save();  

  return res.status(200).json({ message: "Refund Item deleted successfully" });  
});