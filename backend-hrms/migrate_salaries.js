import db from "./config/db.js";

const sql = `ALTER TABLE salaries ADD COLUMN status ENUM('Pending', 'Generated', 'Paid') NOT DEFAULT 'Generated'`;
// Wait, user said "After calculate -> Pending. After generate -> Generated. After payment -> Paid".
// Actually, calculate = generate in this system context? 
// Let's use: default 'Generated'.

db.query("ALTER TABLE salaries ADD COLUMN status ENUM('Pending', 'Generated', 'Paid') DEFAULT 'Generated'", (err) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Status column already exists.");
        } else {
            console.error("Error adding column:", err);
            process.exit(1);
        }
    } else {
        console.log("Status column added successfully.");
    }
    process.exit(0);
});
