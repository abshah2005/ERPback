import express from 'express';
import {
  createCustomer,
  getCustomersByCompany,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/Customers.controller.js'; 

const router = express.Router();

router.route('/createCustomer').post(createCustomer);

router.route('/getcompanyCustomers/:companyId').get(getCustomersByCompany);

router.route('/getCustomer/:customerId').get(getCustomerById);

router.route('/updateCustomer/:customerId').put(updateCustomer);

router.route('/deleteCustomer/:customerId').delete(deleteCustomer);

export default router;
