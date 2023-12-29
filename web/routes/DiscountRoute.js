import express from "express";
const router = express.Router();

import DiscountController from "../controller/DiscountController.js";

router.post("/api/getDiscountsDetails", DiscountController.getDiscountsDetails);

export default router;
