import express from 'express';
import { 
  createAccount, 
  getAllAccounts, 
  getAccountById, 
  updateAccount, 
  deleteAccount 
} from '../controllers/Account.controller.js';

const router = express.Router();

router.post('/createAccount', createAccount);

router.get('/getAllAccounts', getAllAccounts);

router.get('/getAccountById/:id', getAccountById);

router.put('/updateAccount/:id', updateAccount);

router.delete('/deleteAccount/:id', deleteAccount);

export default router;
