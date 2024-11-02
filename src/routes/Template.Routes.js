import express from "express";
import {
    saveTemplate
  } from "../controllers/Template.Controller.js";
const router = express.Router();

router.route("/saveTemplate").post(saveTemplate);

export default router;