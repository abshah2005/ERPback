import { Company } from "../models/Company.model.js";
import { CompanySettings } from "../models/CompanySetting.model.js";
import { AdminUser } from "../models/user.js";
import { Apierror } from "../utils/Apierror.js"
import { asynchandler } from "../utils/Asynchandler.js";

export const createCompany = asynchandler(async (req, res) => {
  const {
    name,
    type,
    country,
    city,
    state,
    zip,
    email,
    contactPerson,
    phone,
    fax,
    companyNo,
    logo,
    signature,
  } = req.body;

  if (!name  || !type || !country || !city || !state || !zip || !email || !contactPerson || !phone || !fax || !companyNo || !logo || !signature) {
    throw new Apierror(400, "All fields are required.");
  }
  // const admin=await AdminUser.findById(adminId);
  // if(!admin){
  //   throw new Apierror(404, "Admin not found");
  // }
  function getCurrentMonth() {
    const date = new Date();
    const options = { month: 'long' }; // 'long' for full month name
    return date.toLocaleString('default', options);
}
   const month=getCurrentMonth();

  const newCompany = await Company.create({
    name,
    adminId:req.user._id,
    type,
    country,
    city,
    state,
    zip,
    email,
    contactPerson,
    phone,
    fax,
    companyNo,
    logo,
    signature,
  });

  const defaultSettings = {
    companyId: newCompany._id,
    currentCurrency: "USD",
    finYearStart:month,
    allow_multi_currency: false,
    currencySymbol: "$",
    decimalPlaces: 2,
    multiplePriceLevels: false,
    enableMultipleDiscount: false,
    enableNegativeStockEntries: false,
    EnableImageCompression: true,
    showPackagingDetails: true,
    AllowSalesPersonInvoiceFilter: true,
    ShowSalePrice: true,
    ShowCostPrice: true,
    ShowRetailPrice: true,
    ShowOutstandingBalanceInward: true,
    ShowOutstandingBalanceOutward: true,
    ShowTransactionNo: true,
    enable_narration: true,
    manually_manage_eod: false,
    allow_pos_discount: false,
  };

  await CompanySettings.create(defaultSettings);

  return res.status(201).json({ message: "Company created successfully", company: newCompany });
});

export const getAllCompanies = asynchandler(async (req, res) => {
  const companies = await Company.find({ adminId: req.user._id });
  return res.status(200).json(companies);
});

export const getCompanyById = asynchandler(async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId).populate("adminId");

  if (!company) {
    throw new Apierror(404, "Company not found.");
  }

  return res.status(200).json(company);
});

export const updateCompany = asynchandler(async (req, res) => {
  const { companyId } = req.params;

  const existingCompany = await Company.findById(companyId);
  if (!existingCompany) {
    throw new Apierror(404, "Company not found.");
  }

  const updateFields = {};

  if (req.body.name) updateFields.name = req.body.name;
  if (req.body.type) updateFields.type = req.body.type;
  if (req.body.country) updateFields.country = req.body.country;
  if (req.body.city) updateFields.city = req.body.city;
  if (req.body.state) updateFields.state = req.body.state;
  if (req.body.zip) updateFields.zip = req.body.zip;
  if (req.body.email) updateFields.email = req.body.email;
  if (req.body.contactPerson) updateFields.contactPerson = req.body.contactPerson;
  if (req.body.phone) updateFields.phone = req.body.phone;
  if (req.body.fax) updateFields.fax = req.body.fax;
  if (req.body.companyNo) updateFields.companyNo = req.body.companyNo;
  if (req.body.logo) updateFields.logo = req.body.logo;
  if (req.body.signature) updateFields.signature = req.body.signature;

  const updatedCompany = await Company.findByIdAndUpdate(companyId, updateFields, { new: true, runValidators: true });

  return res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
});

export const deleteCompany = asynchandler(async (req, res) => {
  const { companyId } = req.params;

  await CompanySettings.findOneAndDelete({ companyId });

  const deletedCompany = await Company.findByIdAndDelete(companyId);
  if (!deletedCompany) {
    throw new Apierror(404, "Company not found.");
  }

  return res.status(200).json({ message: "Company and associated settings deleted successfully" });
});