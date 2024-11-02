import express from 'express';
import {
  createAccountType,
  getAllAccountTypes,
  getAccountTypeById,
  updateAccountType,
  deleteAccountType
} from '../controllers/AccountType.controller.js';

const router = express.Router();

// Route to create a new account type
router.post('/createAccountType', createAccountType);

// Route to get all account types by company ID (expects companyId as a query parameter)
router.get('/getAllAccountTypes', getAllAccountTypes);

// Route to get a specific account type by ID
router.get('/getAccountTypeById/:id', getAccountTypeById);

// Route to update an account type by ID
router.put('/updateAccountType/:id', updateAccountType);

// Route to delete an account type by ID
router.delete('/deleteAccountType/:id', deleteAccountType);

export default router;
