import express from "express";
import {
addPolicy,
getPolicies,
deletePolicy
} from "../controllers/policyController.js";

const router = express.Router();

router.post("/add",addPolicy);
router.get("/all",getPolicies);
router.delete("/delete/:id",deletePolicy);

export default router;