import express from "express";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/today/:employee_id", getTodayAttendance);
router.get("/history/:employee_id", getAttendanceHistory);
router.get("/all", getAllAttendance);

export default router;