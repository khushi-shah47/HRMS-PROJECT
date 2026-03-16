import express from "express";
import {
  addHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday
} from "../controllers/holidayController.js";

const router = express.Router();

router.post("/add", addHoliday);
router.get("/all", getHolidays);
router.put("/update/:id", updateHoliday);
router.delete("/delete/:id", deleteHoliday);

export default router;