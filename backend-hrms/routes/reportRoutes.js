import express from "express";
import { attendanceReport, leaveReport, taskReport, getReportSummary } from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/attendance", verifyToken, authorizeRoles("admin", "hr", "manager"), attendanceReport);
router.get("/leave", verifyToken, authorizeRoles("admin", "hr", "manager"), leaveReport);
router.get("/tasks", verifyToken, authorizeRoles("admin", "hr", "manager"), taskReport);
router.get("/summary", verifyToken, authorizeRoles("admin", "hr", "manager"), getReportSummary);

export default router;