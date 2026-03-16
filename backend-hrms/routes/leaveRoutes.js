import express from "express";
import { applyLeave,  getLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", applyLeave);
router.get("/", getLeaves);
router.put("/:id", verifyToken, authorizeRoles("Admin", "HR", "Manager"), updateLeaveStatus);

export default router;