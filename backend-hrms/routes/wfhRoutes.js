import express from "express";
import {
  applyWFH,
  approveWFH,
  rejectWFH,
  getWFHHistory,
  getAllWFH
} from "../controllers/wfhController.js";

const router = express.Router();

router.post("/apply", applyWFH);
router.post("/approve", approveWFH);
router.post("/reject", rejectWFH);

router.get("/history/:employee_id", getWFHHistory);
router.get("/all", getAllWFH);

export default router;
