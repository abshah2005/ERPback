import { Customers } from "../models/Customer.model.js";
import { Company } from "../models/Company.model.js"; 
import { Categories } from "../models/Categories.model.js"; 
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";


export const createCustomer = asynchandler(async (req, res) => {
  const {
    name,
    short_name,
    display_name,
    primary_email,
    phone_number,
    category_id,
    companyId, 
  } = req.body;


  if (!name || !short_name || !display_name || !primary_email || !phone_number || !category_id || !companyId ||
      name.trim() === "" || short_name.trim() === "" || display_name.trim() === "" || primary_email.trim() === "" || 
      phone_number.trim() === "" || category_id.trim() === "" || companyId.trim() === "") {
    throw new Apierror(400, "All fields are required and cannot be empty.");
  }

  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    throw new Apierror(404, "Company not found.");
  }

  const categoryExists = await Categories.findById(category_id);
  if (!categoryExists) {
    throw new Apierror(404, "Category not found.");
  }

  const newCustomer = await Customers.create(req.body);
  return res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
});

export const getCustomersByCompany = asynchandler(async (req, res) => {
  const { companyId } = req.params; 

  const companyExists = await Company.findById(companyId);
  if (!companyExists) {
    throw new Apierror(404, "Company not found.");
  }

  const customers = await Customers.find({ companyId: companyId });

  if (!customers || customers.length === 0) {
    throw new Apierror(404, "No customers found for this company.");
  }

  return res.status(200).json(customers);
});

export const getCustomerById = asynchandler(async (req, res) => {
  const { customerId } = req.params;
  const customer = await Customers.findById(customerId);

  if (!customer) {
    throw new Apierror(404, "Customer not found.");
  }

  return res.status(200).json(customer);
});

export const updateCustomer = asynchandler(async (req, res) => {
  const { customerId } = req.params;

  const { name, short_name, display_name, primary_email, phone_number, category_id, companyId } = req.body;

  if (name && name.trim() === "") throw new Apierror(400, "Name cannot be empty.");
  if (short_name && short_name.trim() === "") throw new Apierror(400, "Short name cannot be empty.");
  if (display_name && display_name.trim() === "") throw new Apierror(400, "Display name cannot be empty.");
  if (primary_email && primary_email.trim() === "") throw new Apierror(400, "Primary email cannot be empty.");
  if (phone_number && phone_number.trim() === "") throw new Apierror(400, "Phone number cannot be empty.");
  if (category_id && category_id.trim() === "") throw new Apierror(400, "Category ID cannot be empty.");
  if (companyId && companyId.trim() === "") throw new Apierror(400, "Company ID cannot be empty.");

  if (companyId) {
    const companyExists = await Companies.findById(companyId);
    if (!companyExists) {
      throw new Apierror(404, "Company not found.");
    }
  }

  if (category_id) {
    const categoryExists = await Categories.findById(category_id);
    if (!categoryExists) {
      throw new Apierror(404, "Category not found.");
    }
  }

  const updatedCustomer = await Customers.findByIdAndUpdate(customerId, req.body, { new: true, runValidators: true });

  if (!updatedCustomer) {
    throw new Apierror(404, "Customer not found.");
  }

  return res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
});

export const deleteCustomer = asynchandler(async (req, res) => {
  const { customerId } = req.params;
  const deletedCustomer = await Customers.findByIdAndDelete(customerId);

  if (!deletedCustomer) {
    throw new Apierror(404, "Customer not found.");
  }

  return res.status(200).json({ message: "Customer deleted successfully" });
});
