import express from "express";
import {
  getCompanySettings,
  updateCompanySettings,
} from "../controllers/CompanySettings.controller.js";
import { verifyAdminJWT } from "../middlewares/Authentication.middleware.js";

const router = express.Router();

router
  .route("/getCompanySettings/:companyId")
  .get(verifyAdminJWT, getCompanySettings);

router
  .route("/updateCompanySettings/:companyId")
  .put(verifyAdminJWT, updateCompanySettings);

export default router;
