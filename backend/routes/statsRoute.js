import express from "express";
import  auth  from "../middleware/authMiddleware.js";
import { getStats } from "../controller/statsController.js";

const router = express.Router();
router.get("/", auth, getStats);

export default router;