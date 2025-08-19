import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {config} from "../common/config.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        (req as any).user = jwt.verify(token, config.JWT_SECRET) as any;
        next();
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
};