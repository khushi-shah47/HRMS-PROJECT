import express from "express";
import {
  createTask,
  getAllTasks,
  getEmployeeTasks,
  updateTaskStatus,
  deleteTask,
  getMyTasks,
  updateTask,
  getTaskById,
  getGivenTasks
} from "../controllers/taskController.js";
import {
  getTaskComments,
  addTaskComment,
  deleteTaskComment
} from "../controllers/commentController.js";
import {
  getTaskAttachments,
  uploadAttachment,
  deleteAttachment
} from "../controllers/attachmentController.js";
import upload from "../middleware/uploadMiddleware.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin", "manager", "hr"), createTask);
router.get("/", verifyToken, authorizeRoles("admin", "manager", "hr"), getAllTasks);
router.get("/my", verifyToken, getMyTasks);
router.get("/given", verifyToken, getGivenTasks);
router.get("/:id", verifyToken, getTaskById);
router.get("/employee/:employee_id", verifyToken, getEmployeeTasks);
router.put("/:id", verifyToken, authorizeRoles("admin", "manager", "hr"), updateTask);
router.put("/:id/status", verifyToken, updateTaskStatus);
router.delete("/:id", verifyToken, authorizeRoles("admin", "manager", "hr"), deleteTask);

// Comments
router.get("/:id/comments", verifyToken, getTaskComments);
router.post("/:id/comments", verifyToken, addTaskComment);
router.delete("/comments/:commentId", verifyToken, deleteTaskComment);

// Attachments
router.get("/:id/attachments", verifyToken, getTaskAttachments);
router.post("/:id/attachments", verifyToken, upload.single("file"), uploadAttachment);
router.delete("/attachments/:attachmentId", verifyToken, deleteAttachment);

export default router;