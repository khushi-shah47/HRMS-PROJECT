import db from "./config/db.js";
import fs from "fs";

const sql = `
    SELECT a.*, u.username as author_name
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    ORDER BY a.created_at DESC
`;

db.query(sql, (err, results) => {
  if (err) {
    fs.writeFileSync("query_debug.json", JSON.stringify({ error: err.message, code: err.code }, null, 2));
  } else {
    fs.writeFileSync("query_debug.json", JSON.stringify({ success: true, count: results.length, data: results.slice(0, 2) }, null, 2));
  }
  process.exit();
});
