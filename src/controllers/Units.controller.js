import { Units } from "../models/Unit.model.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";


export const createUnit = asynchandler(async (req, res) => {
  const { name, symbol, Shortname } = req.body;

  if (!name || !symbol || !Shortname) {
    throw new Apierror(400, "All fields are required.");
  }

  const existingUnit = await Units.findOne({ name });
  if (existingUnit) {
    throw new Apierror(409, "Unit already exists.");
  }

  const newUnit = await Units.create({ name, symbol, Shortname });
  return res.status(201).json({ message: "Unit created successfully", unit: newUnit });
});

export const getAllUnits = asynchandler(async (req, res) => {
  const units = await Units.find();
  return res.status(200).json(units);
});

export const getUnitById = asynchandler(async (req, res) => {
  const { unitId } = req.params;
  const unit = await Units.findById(unitId);

  if (!unit) {
    throw new Apierror(404, "Unit not found.");
  }

  return res.status(200).json(unit);
});

export const updateUnit = asynchandler(async (req, res) => {
  const { unitId } = req.params;
  const { name, symbol, Shortname } = req.body;

  if (name && !name.trim()) throw new Apierror(400, "Name cannot be empty.");
  if (symbol && !symbol.trim()) throw new Apierror(400, "Symbol cannot be empty.");
  if (Shortname && !Shortname.trim()) throw new Apierror(400, "Shortname cannot be empty.");

  const unit = await Units.findById(unitId);
  if (!unit) {
    throw new Apierror(404, "Unit not found.");
  }

  const updatedUnit = await Units.findByIdAndUpdate(
    unitId,
    { name, symbol, Shortname },
    { new: true, runValidators: true }
  );

  return res.status(200).json({ message: "Unit updated successfully", unit: updatedUnit });
});

export const deleteUnit = asynchandler(async (req, res) => {
  const { unitId } = req.params;
  const deletedUnit = await Units.findByIdAndDelete(unitId);

  if (!deletedUnit) {
    throw new Apierror(404, "Unit not found.");
  }

  return res.status(200).json({ message: "Unit deleted successfully" });
});
