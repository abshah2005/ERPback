import { Products } from "../models/Product.model.js";
import { Company } from "../models/Company.model.js";
import { Units } from "../models/Unit.model.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";


export const createProduct = asynchandler(async (req, res) => {
  const { name, unit_id, CompanyId, purchase_price, sale_price } = req.body;

  if (!name || !unit_id || !CompanyId || !purchase_price || !sale_price) {
    throw new Apierror(400, "All required fields must be provided.");
  }

  const [company, unit] = await Promise.all([
    Company.findById(CompanyId),
    Units.findById(unit_id),
  ]);

  if (!company) {
    throw new Apierror(404, "Company not found.");
  }

  if (!unit) {
    throw new Apierror(404, "Unit not found.");
  }

  const newProduct = new Products(req.body);
  await newProduct.save();

  res.status(201).json({ success: true, data: newProduct });
});


export const getAllProducts = asynchandler(async (req, res) => {
  const { companyId } = req.params;

  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Apierror(404, "Company not found.");
    }
  }

  // const filter = companyId ? { CompanyId: companyId } : {};
  const products = await Products.find({CompanyId:companyId})
    .populate("unit_id", "name symbol")
    .populate("CompanyId", "name");

  res.status(200).json({ success: true, data: products });
});


export const getProductById = asynchandler(async (req, res) => {
  const { id } = req.params;

  const product = await Products.findById(id)
    .populate("unit_id", "name symbol")
    .populate("CompanyId", "name");

  if (!product) {
    throw new Apierror(404, "Product not found.");
  }

  res.status(200).json({ success: true, data: product });
});


export const updateProduct = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const product = await Products.findById(id);
  if (!product) {
    throw new Apierror(404, "Product not found.");
  }

  if (updatedData.CompanyId) {
    const company = await Company.findById(updatedData.CompanyId);
    if (!company) {
      throw new Apierror(404, "Company not found.");
    }
  }

  if (updatedData.unit_id) {
    const unit = await Units.findById(updatedData.unit_id);
    if (!unit) {
      throw new Apierror(404, "Unit not found.");
    }
  }

  const updatedProduct = await Products.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: updatedProduct });
});


export const deleteProduct = asynchandler(async (req, res) => {
  const { id } = req.params;

  const product = await Products.findByIdAndDelete(id);
  if (!product) {
    throw new Apierror(404, "Product not found.");
  }

  res.status(200).json({ success: true, message: "Product deleted successfully." });
});
