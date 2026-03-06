import express from "express";
import { attendanceReport, leaveReport, taskReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/attendance", attendanceReport);
router.get("/leave", leaveReport);
router.get("/tasks", taskReport);

export default router;