import { Account } from "../models/Account.model.js";
import { AccountType } from "../models/AccountType.model.js";
import { Company } from "../models/Company.model.js"; 
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";

const isEmptyString = (value) => typeof value === 'string' && value.trim() === '';

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

export const createAccount = asynchandler(async (req, res) => {
  const { 
    name, 
    description, 
    code, 
    account_type_id, 
    bankName, 
    branch, 
    accountTitle, 
    accountNo, 
    CompanyId 
  } = req.body;

  
  if (isEmptyString(name)) {
    throw new Apierror(400, "Name is required and cannot be empty");
  }
  if (isEmptyString(description)) {
    throw new Apierror(400, "Description is required and cannot be empty");
  }
  if (isEmptyString(code)) {
    throw new Apierror(400, "Code is required and cannot be empty");
  }
  if (!account_type_id) {
    throw new Apierror(400, "Account Type ID is required");
  }
  if (isEmptyString(bankName)) {
    throw new Apierror(400, "Bank Name is required and cannot be empty");
  }
  if (isEmptyString(branch)) {
    throw new Apierror(400, "Branch is required and cannot be empty");
  }
  if (isEmptyString(accountTitle)) {
    throw new Apierror(400, "Account Title is required and cannot be empty");
  }
  if (isEmptyString(accountNo)) {
    throw new Apierror(400, "Account Number is required and cannot be empty");
  }
  if (!CompanyId) {
    throw new Apierror(400, "Company ID is required");
  }

  await checkAccountTypeExists(account_type_id);
  
  await checkCompanyExists(CompanyId);

  const newAccount = new Account({
    name,
    description,
    code,
    account_type_id,
    bankName,
    branch,
    accountTitle,
    accountNo,
    CompanyId,
  });

  await newAccount.save();
  res.status(201).json({ success: true, data: newAccount });
});

export const getAllAccounts = asynchandler(async (req, res) => {
  const { companyId } = req.query;

  if (!companyId) {
    throw new Apierror(400, "Company ID is required");
  }

  await checkCompanyExists(companyId);

  const accounts = await Account.find({ CompanyId: companyId })
    .populate("account_type_id", "name code")
    .populate("CompanyId", "name");

  res.status(200).json({ success: true, data: accounts });
});

export const getAccountById = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Apierror(400, "Account ID is required");
  }

  const account = await Account.findById(id)
    .populate("account_type_id", "name code")
    .populate("CompanyId", "name");

  if (!account) {
    throw new Apierror(404, "Account not found");
  }

  res.status(200).json({ success: true, data: account });
});

export const updateAccount = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    throw new Apierror(400, "Account ID is required");
  }

  if (updatedData.account_type_id) {
    // Check if the Account Type exists if provided
    await checkAccountTypeExists(updatedData.account_type_id);
  }

  // Check for empty string updates
  if (updatedData.name && isEmptyString(updatedData.name)) {
    throw new Apierror(400, "Name must be a non-empty string");
  }
  if (updatedData.description && isEmptyString(updatedData.description)) {
    throw new Apierror(400, "Description must be a non-empty string");
  }
  if (updatedData.code && isEmptyString(updatedData.code)) {
    throw new Apierror(400, "Code must be a non-empty string");
  }
  if (updatedData.bankName && isEmptyString(updatedData.bankName)) {
    throw new Apierror(400, "Bank Name must be a non-empty string");
  }
  if (updatedData.branch && isEmptyString(updatedData.branch)) {
    throw new Apierror(400, "Branch must be a non-empty string");
  }
  if (updatedData.accountTitle && isEmptyString(updatedData.accountTitle)) {
    throw new Apierror(400, "Account Title must be a non-empty string");
  }
  if (updatedData.accountNo && isEmptyString(updatedData.accountNo)) {
    throw new Apierror(400, "Account Number must be a non-empty string");
  }

  const account = await Account.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

  if (!account) {
    throw new Apierror(404, "Account not found");
  }

  res.status(200).json({ success: true, data: account });
});

export const deleteAccount = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Apierror(400, "Account ID is required");
  }

  const account = await Account.findByIdAndDelete(id);

  if (!account) {
    throw new Apierror(404, "Account not found");
  }

  res.status(200).json({ success: true, message: "Account deleted successfully" });
});
