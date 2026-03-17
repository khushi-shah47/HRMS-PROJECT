import express from "express";
import { getEmployeeById, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get employee by ID
router.get("/:id", verifyToken, getEmployeeById);

// Update employee profile
router.put("/:id", verifyToken, updateProfile);

export default router;
