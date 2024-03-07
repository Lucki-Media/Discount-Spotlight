import express from "express";
const router = express.Router();

import CountController from "../controller/CountController.js";


// FRONTEND API
router.post("/api/countOfLabelClick", CountController.countOfLabelClick);

export default router;
