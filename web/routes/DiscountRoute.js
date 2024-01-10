import express from "express";
const router = express.Router();

import DiscountController from "../controller/DiscountController.js";

// GET DETAILS API
router.post("/api/getDiscountsDetails", DiscountController.getDiscountsDetails);

// SAVE DETAILS API
router.post(
  "/api/saveDiscountsDetails",
  DiscountController.saveDiscountsDetails
);

// FRONTEND API
router.post("/api/getDiscounts", DiscountController.getDiscounts);

export default router;
