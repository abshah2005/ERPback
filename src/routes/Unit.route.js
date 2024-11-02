import express from "express";
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controllers/Units.controller.js";

const router = express.Router();

router.post("/createUnit", createUnit);

router.get("/getUnits", getAllUnits);

router.get("/getUnit/:unitId", getUnitById);

router.put("/updateUnit/:unitId", updateUnit);

router.delete("/deleteUnit/:unitId", deleteUnit);

export default router;
