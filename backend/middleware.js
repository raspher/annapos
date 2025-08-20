import jwt from "jsonwebtoken";

// todo: read from env
const secretKey = 'your_secret_key';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Token required');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
}