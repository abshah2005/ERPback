import { Warehouse } from "../models/Warehouse.model.js";  
import { Apierror } from "../utils/Apierror.js";  
import { asynchandler } from "../utils/Asynchandler.js";  

export const createWarehouse = asynchandler(async (req, res) => {  
  const { name, short_name, address, capacity, type } = req.body;  

  if (!name || !address || !capacity || !type) {  
    throw new Apierror(400, "Name, address, capacity, and type are required.");  
  }  

  const existingWarehouse = await Warehouse.findOne({ name });  
  if (existingWarehouse) {  
    throw new Apierror(400, "A warehouse with this name already exists.");  
  }  

  const newWarehouse = await Warehouse.create({  
    name,  
    short_name,  
    address,  
    capacity,  
    type,  
  });  

  return res.status(201).json({ message: "Warehouse created successfully", warehouse: newWarehouse });  
});  

export const getAllWarehouses = asynchandler(async (req, res) => {  
  const warehouses = await Warehouse.find();  
  return res.status(200).json(warehouses);  
});  

export const getWarehouseById = asynchandler(async (req, res) => {  
  const { warehouseId } = req.params;  
  const warehouse = await Warehouse.findById(warehouseId);  

  if (!warehouse) {  
    throw new Apierror(404, "Warehouse not found.");  
  }  

  return res.status(200).json(warehouse);  
});  

export const updateWarehouse = asynchandler(async (req, res) => {  
  const { warehouseId } = req.params;  
  const updateData = req.body;  

  const existingWarehouse = await Warehouse.findById(warehouseId);  
  if (!existingWarehouse) {  
    throw new Apierror(404, "Warehouse not found.");  
  }  

  if (updateData.name) {  
    const duplicateWarehouse = await Warehouse.findOne({ name: updateData.name });  
    if (duplicateWarehouse && duplicateWarehouse._id.toString() !== warehouseId) {  
      throw new Apierror(400, "A warehouse with this name already exists.");  
    }  
  }  

  const updateFields = {};  

  if (updateData.name) updateFields.name = updateData.name;  
  if (updateData.short_name) updateFields.short_name = updateData.short_name;  
  if (updateData.address) updateFields.address = updateData.address;  
  if (updateData.capacity) updateFields.capacity = updateData.capacity;  
  if (updateData.type) updateFields.type = updateData.type;  

  const updatedWarehouse = await Warehouse.findByIdAndUpdate(warehouseId, updateFields, {  
    new: true,  
    runValidators: true,  
  });  

  return res.status(200).json({ message: "Warehouse updated successfully", warehouse: updatedWarehouse });  
});  

export const deleteWarehouse = asynchandler(async (req, res) => {  
  const { warehouseId } = req.params;  

  const deletedWarehouse = await Warehouse.findByIdAndDelete(warehouseId);  
  if (!deletedWarehouse) {  
    throw new Apierror(404, "Warehouse not found.");  
  }  

  return res.status(200).json({ message: "Warehouse deleted successfully." });  
});