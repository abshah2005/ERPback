import express from "express";
import {
  createVendor,
  getVendorsByCompany,
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../controllers/Vendors.controller.js";

const router = express.Router();

router.post("/createVendor", createVendor);

router.get("/getVendorbycompany/:companyId", getVendorsByCompany);

router.get("/getVendor/:vendorId", getVendorById);

router.put("/updateVendor:vendorId", updateVendor);

router.delete("/deleteVendor/:vendorId", deleteVendor);

export default router;
