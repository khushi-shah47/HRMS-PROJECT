import express from "express";

import {
  createTask,
  getAllTasks,
  getEmployeeTasks,
  updateTaskStatus,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);

router.get("/", getAllTasks);

router.get("/employee/:employee_id", getEmployeeTasks);

router.put("/:id/status", updateTaskStatus);

router.delete("/:id", deleteTask);

export default router;