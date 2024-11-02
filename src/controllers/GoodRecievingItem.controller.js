import { GoodsReceivingItem } from "../models/GoodsReceivingItem.model.js";   
import { Products } from "../models/Product.model.js"; 
import { GoodsReceiving } from "../models/GoodsReceiving.model.js";   
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createGoodsReceivingItem = asynchandler(async (req, res) => {  
  const { goodsReceiving_id, product_id, qty } = req.body;  

  if (!goodsReceiving_id || !product_id || !qty || qty <= 0) {  
    throw new Apierror(400, "Goods Receiving ID, Product ID, and quantity (greater than 0) are required.");  
  }  

  const goodsReceivingExists = await GoodsReceiving.findById(goodsReceiving_id);  
  if (!goodsReceivingExists) {  
    throw new Apierror(404, "Goods Receiving not found.");  
  }  

  const productExists = await Products.findById(product_id);  
  if (!productExists) {  
    throw new Apierror(404, "Product not found.");  
  }  

  const newGoodsReceivingItem = await GoodsReceivingItem.create(req.body);  
  return res.status(201).json({ message: "Goods Receiving Item created successfully", goodsReceivingItem: newGoodsReceivingItem });  
});  

export const getGoodsReceivingItems = asynchandler(async (req, res) => {  
  const goodsReceivingItems = await GoodsReceivingItem.find().populate('product_id warehouse_id');  
  return res.status(200).json(goodsReceivingItems);  
});  

export const getGoodsReceivingItemById = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const goodsReceivingItem = await GoodsReceivingItem.findById(id).populate('product_id');  

  if (!goodsReceivingItem) {  
    throw new Apierror(404, "Goods Receiving Item not found.");  
  }  

  return res.status(200).json(goodsReceivingItem);  
});  

export const updateGoodsReceivingItem = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const { goodsReceiving_id, product_id, qty } = req.body;  

  if (goodsReceiving_id && !goodsReceiving_id.trim()) {  
    throw new Apierror(400, "Goods Receiving ID cannot be empty.");  
  }  
  if (product_id && !product_id.trim()) {  
    throw new Apierror(400, "Product ID cannot be empty.");  
  }  
  if (qty && qty <= 0) {  
    throw new Apierror(400, "Quantity must be greater than 0.");  
  }  

  if (goodsReceiving_id) {  
    const goodsReceivingExists = await GoodsReceiving.findById(goodsReceiving_id);  
    if (!goodsReceivingExists) {  
      throw new Apierror(404, "Goods Receiving not found.");  
    }  
  }  

  if (product_id) {  
    const productExists = await Products.findById(product_id);  
    if (!productExists) {  
      throw new Apierror(404, "Product not found.");  
    }  
  }  

  const updatedGoodsReceivingItem = await GoodsReceivingItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

  if (!updatedGoodsReceivingItem) {  
    throw new Apierror(404, "Goods Receiving Item not found.");  
  }  

  return res.status(200).json({ message: "Goods Receiving Item updated successfully", goodsReceivingItem: updatedGoodsReceivingItem });  
});  

export const deleteGoodsReceivingItem = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const deletedGoodsReceivingItem = await GoodsReceivingItem.findByIdAndDelete(id);  

  if (!deletedGoodsReceivingItem) {  
    throw new Apierror(404, "Goods Receiving Item not found.");  
  }  

  return res.status(200).json({ message: "Goods Receiving Item deleted successfully" });  
});