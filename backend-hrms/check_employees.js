import db from "./config/db.js";
import fs from "fs";

const sql = "DESCRIBE employees";

db.query(sql, (err, results) => {
  if (err) {
    fs.writeFileSync("employees_structure.json", JSON.stringify({ error: err.message }, null, 2));
  } else {
    fs.writeFileSync("employees_structure.json", JSON.stringify(results, null, 2));
  }
  process.exit();
});
