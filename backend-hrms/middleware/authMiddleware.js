import jwt from "jsonwebtoken";
import db from "../config/db.js";

const SECRET = "hrms_secret_key";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;

        // Resolve employee_id from userId (Clean Architecture)
        const sql = "SELECT id FROM employees WHERE user_id = ?";
        db.query(sql, [decoded.id], (err, results) => {
            if (err) {
                console.error("Error resolving employee_id in middleware:", err);
                // We still proceed, but employee_id will be null
                req.user.employee_id = null;
            } else {
                req.user.employee_id = results[0]?.id || null;
            }
            next();
        });

    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
