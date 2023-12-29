import express from "express";
const router = express.Router();

import CustomizationController from "../controller/CustomizationController.js";

// GET DETAILS API 
router.post("/api/getCustomizationDetails", CustomizationController.getCustomizationDetails);

// SAVE DETAILS API 
router.post("/api/saveCustomizationDetails", CustomizationController.saveCustomizationDetails);

export default router;
