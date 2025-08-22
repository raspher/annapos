import jwt from "jsonwebtoken";
import xss from 'xss';
import {config} from "./config.js";

export function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({message: "Unauthorized"});

    try {
        req.user = jwt.verify(token, config.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
}

const sanitize = (obj) => {
    if (typeof obj === "string") return xss(obj);
    if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
            obj[key] = sanitize(obj[key]);
        }
    }
    return obj;
};

export function sanitizer(req, res, next) {
    req.body = sanitize(req.body);

    for (const key of Object.keys(req.query)) {
        req.query[key] = sanitize(req.query[key]);
    }

    for (const key of Object.keys(req.params)) {
        req.params[key] = sanitize(req.params[key]);
    }

    next();
}