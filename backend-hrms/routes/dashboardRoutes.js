import express from "express";
import { getDashboardStats, getRoleStats } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/role-stats", verifyToken, getRoleStats);

export default router;
