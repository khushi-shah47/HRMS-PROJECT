import express from "express";
import { calculateSalary, getSalaryHistory, getSalaryReport } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/calculate", calculateSalary);
router.get("/history/:employee_id", getSalaryHistory);
router.get("/report", getSalaryReport);

export default router;