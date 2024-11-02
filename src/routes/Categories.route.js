import express from 'express';
import {
  createCategory,
  getCategoriesByCompany,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/Categories.controllers.js'; 

const router = express.Router();

router.route('/createCategory').post(createCategory);

router.route('/getCategorybyCompany/:companyId').get(getCategoriesByCompany);

router.route('/getCategory/:categoryId').get(getCategoryById);

router.route('/updateCategory/:categoryId').put(updateCategory);

router.route('/deleteCategory/:categoryId').delete(deleteCategory);

export default router;
