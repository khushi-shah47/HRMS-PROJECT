import express from "express";
import {
  addUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/add", addUser);
router.get("/all", getUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;