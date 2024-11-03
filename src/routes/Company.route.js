import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/Company.controller.js";
import { verifyAdminJWT } from "../middlewares/Authentication.middleware.js";
import {upload} from "../middlewares/Multer.middleware.js"

const router = express.Router();

router.route("/createCompany").post(verifyAdminJWT,upload.fields([{ name: "logo" }, { name: "signature" }]) ,createCompany);

router.route("/getAllCompanies").get(verifyAdminJWT, getAllCompanies); 

router.route("/getCompanybyId/:companyId").get(verifyAdminJWT, getCompanyById);

router.route("/updateCompany/:companyId").put(verifyAdminJWT,upload.fields([{ name: "logo" }, { name: "signature" }]) ,updateCompany);

router.route("/deleteCompany/:companyId").delete(verifyAdminJWT, deleteCompany);

export default router;
