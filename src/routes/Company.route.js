import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/Company.controller.js";
import { verifyAdminJWT } from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router.route("/createCompany").post(verifyAdminJWT, createCompany);

router.route("/getAllCompanies").get(verifyAdminJWT, getAllCompanies); 

router.route("/getCompanybyId/:companyId").get(verifyAdminJWT, getCompanyById);

router.route("/updateCompany/:companyId").put(verifyAdminJWT, updateCompany);

router.route("/deleteCompany/:companyId").delete(verifyAdminJWT, deleteCompany);

export default router;
