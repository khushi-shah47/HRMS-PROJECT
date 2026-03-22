// routes/adminRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createEmployee,
  getHrs,
  getManagers
} from "../controllers/adminController.js";

const router = express.Router();

// GET /api/admin/hrs — all HR employees
router.get("/hrs", verifyToken, authorizeRoles("admin"), getHrs);

// GET /api/admin/managers?hrId=<id> — managers under a specific HR
router.get("/managers", verifyToken, authorizeRoles("admin"), getManagers);

// POST /api/admin/create-employee — create user + employee atomically
router.post("/create-employee", verifyToken, authorizeRoles("admin"), createEmployee);

export default router;
