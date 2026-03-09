import jwt from "jsonwebtoken";
const SECRET = "hrms_secret_key";

export const verifyToken = (req,res,next)=>{

    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message:"Access denied" });
    try {
        const verified = jwt.verify(token.split(" ")[1],SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({message:"Invalid token"});
    }

};
