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
router.get("/today/:user_id", getTodayAttendance);
router.get("/history/:user_id", getAttendanceHistory);
router.get("/all", getAllAttendance);

export default router;