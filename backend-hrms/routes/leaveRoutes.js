import express from "express";
import{
    applyLeave,
    getLeaves,
    updateLeaveStatus
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/", applyLeave);
router.get("/", getLeaves);
router.put("/:id", updateLeaveStatus);

export default router;