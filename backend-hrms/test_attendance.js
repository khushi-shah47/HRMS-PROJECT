import db from "./config/db.js";
import fs from "fs";

const employeeId = 1; // Assuming 1 exists for testing
const limit = 10;
const offset = 0;

db.query(
  "SELECT * FROM attendance WHERE employee_id=? ORDER BY date DESC LIMIT ? OFFSET ?",
  [employeeId, limit, offset],
  (err, result) => {
    if (err) {
      fs.writeFileSync("attendance_query_debug.json", JSON.stringify({ error: err.message, code: err.code }, null, 2));
    } else {
      fs.writeFileSync("attendance_query_debug.json", JSON.stringify({ success: true, count: result.length, data: result.slice(0, 1) }, null, 2));
    }
    process.exit();
  }
);
