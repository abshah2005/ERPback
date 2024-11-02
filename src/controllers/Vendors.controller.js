import { Vendors } from "../models/Vendor.model.js";
import { Company } from "../models/Company.model.js"; // Import the Companies model
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";

export const createVendor = asynchandler(async (req, res) => {
  const {
    name,
    display_name,
    primary_email,
    phone_number,
    category_id,
    companyId, 
    address,
    city,
    country
  } = req.body;

  if (!name || !display_name || !primary_email || !phone_number || !category_id || !companyId || !address || !city || !country) {
    throw new Apierror(400, "All fields are required.");
  }

  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    throw new Apierror(404, "Company not found.");
  }

  const existingVendor = await Vendors.findOne({
    $or: [
      { primary_email: primary_email, companyId: companyId },
      { phone_number: phone_number, companyId: companyId }
    ]
  });

  if (existingVendor) {
    throw new Apierror(409, "A vendor with the same email or phone number already exists for this company.");
  }

  const newVendor = await Vendors.create(req.body);
  return res.status(201).json({ message: "Vendor created successfully", vendor: newVendor });
});

export const getVendorsByCompany = asynchandler(async (req, res) => {
  const { companyId } = req.params;

  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    throw new Apierror(404, "Company not found.");
  }

  const vendors = await Vendors.find({ companyId: companyId }); 

  return res.status(200).json(vendors);
});

export const getVendorById = asynchandler(async (req, res) => {
  const { vendorId } = req.params;
  const vendor = await Vendors.findById(vendorId);

  if (!vendor) {
    throw new Apierror(404, "Vendor not found.");
  }

  return res.status(200).json(vendor);
});

export const updateVendor = asynchandler(async (req, res) => {
  const { vendorId } = req.params;
  const updatedVendor = await Vendors.findByIdAndUpdate(vendorId, req.body, { new: true, runValidators: true });

  if (!updatedVendor) {
    throw new Apierror(404, "Vendor not found.");
  }

  return res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
});

export const deleteVendor = asynchandler(async (req, res) => {
  const { vendorId } = req.params;
  const deletedVendor = await Vendors.findByIdAndDelete(vendorId);

  if (!deletedVendor) {
    throw new Apierror(404, "Vendor not found.");
  }

  return res.status(200).json({ message: "Vendor deleted successfully" });
});
