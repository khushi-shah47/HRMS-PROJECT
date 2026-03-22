import db from "./config/db.js";

const queries = [
    "ALTER TABLE salaries ADD COLUMN allowance DECIMAL(10,2) DEFAULT 0.00 AFTER basic_salary",
    "ALTER TABLE salaries ADD COLUMN bonus DECIMAL(10,2) DEFAULT 0.00 AFTER allowance"
];

const runQuery = (q) => {
    return new Promise((resolve, reject) => {
        db.query(q, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists for query: ${q.substring(0, 50)}...`);
                    resolve();
                } else {
                    reject(err);
                }
            } else {
                console.log(`Success: ${q.substring(0, 50)}...`);
                resolve();
            }
        });
    });
};

const migrate = async () => {
    try {
        for (const q of queries) {
            await runQuery(q);
        }
        console.log("Migration complete.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit(0);
    }
};

migrate();
