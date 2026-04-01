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
import upload from "../middleware/uploadProfile.js"; 
import { sequelize } from "../config/sequelize.js";
import { QueryTypes } from "sequelize";

const router = express.Router();


router.post(
  "/upload-profile/:id",
  upload.single("profile"),
  async (req, res) => {
    try {
      console.log("FILE:", req.file);
      console.log("ID:", req.params.id);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path.replace(/\\/g, "/");

      const result = await sequelize.query(
        `UPDATE employees 
         SET profile_image = :path 
         WHERE id = :id`,
        {
          replacements: {
            path: filePath,
            id: req.params.id
          },
          type: QueryTypes.UPDATE
        }
      );

      console.log("UPDATE RESULT:", result);

      res.json({
        message: "Profile image saved",
        path: filePath
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const employee = await sequelize.query(
      `SELECT * FROM employees WHERE user_id = :userId LIMIT 1`,
      {
        replacements: { userId: req.params.userId },
        type: QueryTypes.SELECT
      }
    );

    if (!employee || employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee[0]);

  } catch (err) {
    console.error("Error fetching employee by user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", verifyToken, authorizeRoles("admin", "hr", "manager"), getEmployees);
router.get("/team", verifyToken, authorizeRoles("manager"), getTeamEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/add", verifyToken, authorizeRoles("admin", "hr"), addEmployee);
router.put("/update/:id", verifyToken, authorizeRoles("admin", "hr"), updateEmployee);
router.delete("/delete/:id", verifyToken, authorizeRoles("admin", "hr"), deleteEmployee);

export default router;