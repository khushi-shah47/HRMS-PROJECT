import db from "./config/db.js";
import fs from "fs";

const sql = `
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)`;

db.query(sql, (err, results) => {
  if (err) {
    fs.writeFileSync("db_results.json", JSON.stringify({ error: err.message }, null, 2));
  } else {
    fs.writeFileSync("db_results.json", JSON.stringify({ message: "Table created or already exists", results }, null, 2));
  }
  process.exit();
});
