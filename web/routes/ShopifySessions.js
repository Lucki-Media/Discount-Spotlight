import express from "express";
const router = express.Router();

import DashBoardController from "../controller/DashBoardController.js";

router.post("/api/shopify_session_data", DashBoardController.shopifySessions);

export default router;
