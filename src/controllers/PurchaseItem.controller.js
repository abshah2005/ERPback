import { PurchaseItem } from "../models/PurchaseItem.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  


export const createPurchaseItem = asynchandler(async (req, res) => {  
  const {  
    product_id,  
    purchase_order_id,  
    qty,  
    price,  
    discount,  
    comments,  
  } = req.body;  

  if (!product_id || !purchase_order_id || !qty || !price) {  
    throw new Apierror(400, "Product ID, Purchase Order ID, quantity, and price are required.");  
  }  

  const newPurchaseItem = await PurchaseItem.create({  
    product_id,  
    purchase_order_id,  
    qty,  
    price,  
    discount,  
    comments,  
  });  

  return res.status(201).json({ message: "Purchase item created successfully", purchaseItem: newPurchaseItem });  
});  

export const getAllPurchaseItems = asynchandler(async (req, res) => {  
  const purchaseItems = await PurchaseItem.find().populate("product_id").populate("purchase_order_id");  
  return res.status(200).json(purchaseItems);  
});  

export const getPurchaseItemById = asynchandler(async (req, res) => {  
  const { purchaseItemId } = req.params;  
  const purchaseItem = await PurchaseItem.findById(purchaseItemId).populate("product_id").populate("purchase_order_id");  

  if (!purchaseItem) {  
    throw new Apierror(404, "Purchase item not found.");  
  }  

  return res.status(200).json(purchaseItem);  
});  

export const updatePurchaseItem = asynchandler(async (req, res) => {  
  const { purchaseItemId } = req.params;  

  const existingItem = await PurchaseItem.findById(purchaseItemId);  
  if (!existingItem) {  
    throw new Apierror(404, "Purchase item not found.");  
  }  

  const updateFields = {};  

  // Validate and assign fields  
  if (req.body.product_id) updateFields.product_id = req.body.product_id;  
  if (req.body.purchase_order_id) updateFields.purchase_order_id = req.body.purchase_order_id;  
  if (req.body.qty) updateFields.qty = req.body.qty;  
  if (req.body.price) updateFields.price = req.body.price;  
  if (req.body.discount != null) updateFields.discount = req.body.discount;  
  if (req.body.comments) updateFields.comments = req.body.comments;  

  // Update the total price based on the new qty, price, and discount  
  if (req.body.qty || req.body.price || req.body.discount != null) {  
    const qty = req.body.qty || existingItem.qty;  
    const price = req.body.price || existingItem.price;  
    const discount = req.body.discount != null ? req.body.discount : existingItem.discount;  

    updateFields.total_price = qty * price * (1 - discount / 100);  
  }  

  const updatedPurchaseItem = await PurchaseItem.findByIdAndUpdate(purchaseItemId, updateFields, {  
    new: true,  
    runValidators: true,  
  });  

  return res.status(200).json({ message: "Purchase item updated successfully", purchaseItem: updatedPurchaseItem });  
});  

export const deletePurchaseItem = asynchandler(async (req, res) => {  
  const { purchaseItemId } = req.params;  

  const deletedPurchaseItem = await PurchaseItem.findByIdAndDelete(purchaseItemId);  
  if (!deletedPurchaseItem) {  
    throw new Apierror(404, "Purchase item not found.");  
  }  

  return res.status(200).json({ message: "Purchase item deleted successfully." });  
});