import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// todo: read from env
dotenv.config({path: "../.env"});
const secretKey = process.env.SECRET_KEY;

export function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        req.user = jwt.verify(token, secretKey);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}