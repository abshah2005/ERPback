import { GoodsReceiving } from "../models/GoodsReceiving.model.js";   
import { Products } from "../models/Product.model.js";   
import { Warehouse } from "../models/Warehouse.model.js";   
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createGoodsReceiving = asynchandler(async (req, res) => {  
  const { product_id, qty, receipt_date, description, comments, attachments, warehouse_id } = req.body;  

  if (!product_id || !qty || qty <= 0 || !warehouse_id) {  
    throw new Apierror(400, "Product ID, quantity (greater than 0), and Warehouse ID are required.");  
  }  

  const productExists = await Products.findById(product_id);  
  if (!productExists) {  
    throw new Apierror(404, "Product not found.");  
  }  

  const warehouseExists = await Warehouse.findById(warehouse_id);  
  if (!warehouseExists) {  
    throw new Apierror(404, "Warehouse not found.");  
  }  

  const newGoodsReceiving = await GoodsReceiving.create(req.body);  
  return res.status(201).json({ message: "Goods Receiving created successfully", goodsReceiving: newGoodsReceiving });  
});  

export const getGoodsReceiving = asynchandler(async (req, res) => {  
  const goodsReceiving = await GoodsReceiving.find().populate('product_id warehouse_id items');  
  return res.status(200).json(goodsReceiving);  
});  

export const getGoodsReceivingById = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const goodsReceiving = await GoodsReceiving.findById(id).populate('product_id warehouse_id items');  

  if (!goodsReceiving) {  
    throw new Apierror(404, "Goods Receiving not found.");  
  }  

  return res.status(200).json(goodsReceiving);  
});  

export const updateGoodsReceiving = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const { product_id, qty, warehouse_id } = req.body;  

  if (product_id && !product_id.trim()) {  
    throw new Apierror(400, "Product ID cannot be empty.");  
  }  
  if (qty && (qty <= 0)) {  
    throw new Apierror(400, "Quantity must be greater than 0.");  
  }  
  if (warehouse_id && !warehouse_id.trim()) {  
    throw new Apierror(400, "Warehouse ID cannot be empty.");  
  }  

  if (product_id) {  
    const productExists = await Products.findById(product_id);  
    if (!productExists) {  
      throw new Apierror(404, "Product not found.");  
    }  
  }  

  if (warehouse_id) {  
    const warehouseExists = await Warehouse.findById(warehouse_id);  
    if (!warehouseExists) {  
      throw new Apierror(404, "Warehouse not found.");  
    }  
  }  

  const updatedGoodsReceiving = await GoodsReceiving.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });  

  if (!updatedGoodsReceiving) {  
    throw new Apierror(404, "Goods Receiving not found.");  
  }  

  return res.status(200).json({ message: "Goods Receiving updated successfully", goodsReceiving: updatedGoodsReceiving });  
});  

export const deleteGoodsReceiving = asynchandler(async (req, res) => {  
  const { id } = req.params;  
  const deletedGoodsReceiving = await GoodsReceiving.findByIdAndDelete(id);  

  if (!deletedGoodsReceiving) {  
    throw new Apierror(404, "Goods Receiving not found.");  
  }  

  return res.status(200).json({ message: "Goods Receiving deleted successfully" });  
});