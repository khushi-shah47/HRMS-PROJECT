import express from "express";
import { login, signup, getCurrentUser, updateProfile, changePassword } from "../controllers/authController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
// router.get("/user/:id", verifyToken, getCurrentUser);
// router.put("/user/:id", verifyToken, updateProfile);
// router.put("/password/:id", verifyToken, changePassword);

export default router;
