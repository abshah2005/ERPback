import { AccountType } from "../models/AccountType.model.js";
import { Company } from "../models/Company.model.js"; 
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";


const checkCompanyExists = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Apierror(404, "Company not found");
  }
};


const checkAccountTypeExists = async (accountTypeId) => {
  const accountType = await AccountType.findById(accountTypeId);
  if (!accountType) {
    throw new Apierror(404, "Account Type not found");
  }
};


export const createAccountType = asynchandler(async (req, res) => {
  const { name, description, code, systemName, CompanyId } = req.body;

  if (
    [name, description, code, systemName, CompanyId].some(field => 
      typeof field === 'string' && field.trim() === ''
    )
  ) {
    throw new Apierror(400, "All fields are required and cannot be empty");
  }

  await checkCompanyExists(CompanyId);

  const newAccountType = new AccountType({
    name,
    description,
    code,
    systemName,
    CompanyId,
  });

  await newAccountType.save();
  res.status(201).json({ success: true, data: newAccountType });
});

export const getAllAccountTypes = asynchandler(async (req, res) => {
  const { companyId } = req.query;

  if (!companyId) {
    throw new Apierror(400, "Company ID is required");
  }


  await checkCompanyExists(companyId);

  const accountTypes = await AccountType.find({ CompanyId: companyId });

  res.status(200).json({ success: true, data: accountTypes });
});


export const getAccountTypeById = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Apierror(400, "Account Type ID is required");
  }

 
  await checkAccountTypeExists(id);

  const accountType = await AccountType.findById(id);
  
  res.status(200).json({ success: true, data: accountType });
});


export const updateAccountType = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    throw new Apierror(400, "Account Type ID is required");
  }

 
  await checkAccountTypeExists(id);

  
  if (
    [updatedData.name, updatedData.description, updatedData.code, updatedData.systemName, updatedData.CompanyId].some(field => 
      field && typeof field === 'string' && field.trim() === ''
    )
  ) {
    throw new Apierror(400, "Fields cannot be empty");
  }

  
  if (updatedData.CompanyId) {
    await checkCompanyExists(updatedData.CompanyId);
  }

  const accountType = await AccountType.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: accountType });
});


export const deleteAccountType = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Apierror(400, "Account Type ID is required");
  }

  
  await checkAccountTypeExists(id);

  const accountType = await AccountType.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Account Type deleted successfully" });
});
