import express from "express";
import {
    generatePDF
  } from "../controllers/Template.Controller.js";
const router = express.Router();

router.route("/generatePDF/:type").post(generatePDF);

export default router;