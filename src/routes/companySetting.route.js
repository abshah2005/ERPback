import express from "express";
import {
  getCompanySettings,
  updateCompanySettings,
} from "../controllers/CompanySettings.controller.js";

const router = express.Router();

router.get("/getCompanySettings/:companyId", getCompanySettings);

router.put("/updateCompanySettings/:companyId", updateCompanySettings);

export default router;
