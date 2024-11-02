import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/Products.controller.js";

const router = express.Router();
router.post("/createProduct", createProduct);
router.get("/getAllproducts/:companyId", getAllProducts);
router.get("/getProduct/:id", getProductById);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
