import express from "express";
import {
  calculateSalary,
  getSalaryHistory,
  getSalaryReport,
  getMySalary,
  getAttendanceStats,
  updateSalaryStatus,
  bulkGenerateSalary,
  getPayrollSummary,
  updateSalaryRecord,
  deleteSalary
} from "../controllers/salaryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/calculate", verifyToken, authorizeRoles("admin", "hr"), calculateSalary);
router.get("/stats", verifyToken, authorizeRoles("admin", "hr"), getAttendanceStats);
router.get("/my", verifyToken, getMySalary);
router.get("/history/:employee_id", verifyToken, authorizeRoles("admin", "hr"), getSalaryHistory);
router.get("/report", verifyToken, authorizeRoles("admin", "hr"), getSalaryReport);
router.get("/summary", verifyToken, authorizeRoles("admin", "hr"), getPayrollSummary);
router.post("/bulk-generate", verifyToken, authorizeRoles("admin", "hr"), bulkGenerateSalary);
router.patch("/status/:id", verifyToken, authorizeRoles("admin", "hr"), updateSalaryStatus);
router.put("/:id", verifyToken, authorizeRoles("admin", "hr"), updateSalaryRecord);
router.delete("/:id", verifyToken, authorizeRoles("admin", "hr"), deleteSalary);

export default router;