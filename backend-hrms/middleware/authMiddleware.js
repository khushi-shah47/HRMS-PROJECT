import jwt from "jsonwebtoken";
const SECRET = "hrms_secret_key";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
        message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message:"Access denied" });
    try {
        const verified = jwt.verify(token, SECRET);  // Fixed: removed .split
        req.user = verified;  // {id, role, employee_id}
        next();
    } catch (err) {
        res.status(401).json({message:"Invalid token"});
    }

};
