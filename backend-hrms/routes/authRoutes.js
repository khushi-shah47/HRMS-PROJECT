import express from "express";
import { login, signup, getCurrentUser, updateProfile, changePassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/user/:id", getCurrentUser);
router.put("/user/:id", updateProfile);
router.put("/password/:id", changePassword);

export default router;
