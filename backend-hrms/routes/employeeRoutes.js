import express from "express";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getTeamEmployees
} from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import uploadProfile from "../middleware/uploadProfile.js";

const router = express.Router();

router.post("/upload-profile/:id", uploadProfile.single("profile"), async (req, res) => {
  try {
    const filePath = req.file.path;

    await db.query(
      "UPDATE employees SET profile_image = ? WHERE id = ?",
      [filePath, req.params.id]
    );

    res.json({ message: "Profile image uploaded", path: filePath });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});
router.get("/", verifyToken, authorizeRoles("admin", "hr"), getEmployees);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addEmployee);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateEmployee);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteEmployee);

export default router;