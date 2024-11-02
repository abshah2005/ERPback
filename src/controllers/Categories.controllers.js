import { Categories } from "../models/Categories.model.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";


export const createCategory = asynchandler(async (req, res) => {
  const { name, CompanyId, description, type } = req.body;

  if (!name || !CompanyId || !description || !type) {
    throw new Apierror(400, "All fields are required.");
  }
  const categoryExists = await Categories.find({name:name});
  if (!categoryExists) {
    throw new Apierror(404, "Category already exists.");
  }

  const newCategory = await Categories.create({ name, CompanyId, description, type });
  return res.status(201).json({ message: "Category created successfully", category: newCategory });
});

export const getCategoriesByCompany = asynchandler(async (req, res) => {
  const { companyId } = req.params;
  const companyExists = await Companies.findById(companyId);
  if (!companyExists) {
    throw new Apierror(404, "Company not found.");
  }
  const categories = await Categories.find({ CompanyId: companyId });

  return res.status(200).json(categories);
});

export const getCategoryById = asynchandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Categories.findById(categoryId);

  if (!category) {
    throw new Apierror(404, "Category not found.");
  }

  return res.status(200).json(category);
});

export const updateCategory = asynchandler(async (req, res) => {
  const { categoryId } = req.params;
  const updatedCategory = await Categories.findByIdAndUpdate(categoryId, req.body, { new: true, runValidators: true });

  if (!updatedCategory) {
    throw new Apierror(404, "Category not found.");
  }

  return res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
});

export const deleteCategory = asynchandler(async (req, res) => {
  const { categoryId } = req.params;
  const deletedCategory = await Categories.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    throw new Apierror(404, "Category not found.");
  }

  return res.status(200).json({ message: "Category deleted successfully" });
});
