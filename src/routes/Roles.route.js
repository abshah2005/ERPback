import express from 'express';
import { 
  createRole, 
  getAllRoles, 
  getRoleById, 
  updateRole, 
  deleteRole 
} from '../controllers/Roles.controller.js'; 
import { verifyAdminJWT } from '../middlewares/Authentication.middleware.js';

const router = express.Router();

router.route('/createrole').post(verifyAdminJWT,createRole);

router.route('/getRoles').get(verifyAdminJWT,getAllRoles);

router.route('/getRole/:id').get(verifyAdminJWT,getRoleById);

router.route('/updateRole/:id').put(verifyAdminJWT,updateRole);

router.route('/deleteRole/:id').delete(verifyAdminJWT,deleteRole);

export default router;
