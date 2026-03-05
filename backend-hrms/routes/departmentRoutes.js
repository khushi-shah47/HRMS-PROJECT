import express from "express";
import {
  addDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/add", addDepartment);
router.get("/all", getDepartments);
router.put("/update/:id", updateDepartment);
router.delete("/delete/:id", deleteDepartment);

export default router;