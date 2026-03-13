import express from "express";
import {
  applyWFH,
  approveWFH,
  rejectWFH,
  getWFHHistory,
  getAllWFH
} from "../controllers/wfhController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/apply", applyWFH);
router.post("/approve", verifyToken, authorizeRoles("Admin", "HR", "Manager"), approveWFH);
router.post("/reject", verifyToken, authorizeRoles("Admin", "HR", "Manager"), rejectWFH);

router.get("/history/:employee_id", getWFHHistory);
router.get("/all", getAllWFH);

export default router;
