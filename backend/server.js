import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import xss from 'xss';

dotenv.config({path: "../.env"});

const app = express();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
    throw new Error("Missing Secret");
}
const apiPort = process.env.API_PORT;
if (!apiPort) {
    throw new Error("Missing API port");
}

// todo: use database
let users = [{
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
}]

app.use(express.json());
app.use(cookieParser());

const sanitize = (obj) => {
    if (typeof obj === "string") return xss(obj);
    if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
            obj[key] = sanitize(obj[key]);
        }
    }
    return obj;
};

app.use((req, res, next) => {
    req.body = sanitize(req.body);

    for (const key of Object.keys(req.query)) {
        req.query[key] = sanitize(req.query[key]);
    }

    for (const key of Object.keys(req.params)) {
        req.params[key] = sanitize(req.params[key]);
    }

    next();
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.username === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.Target === "prod" || false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1h
    });

    res.status(200).send(JSON.stringify({ user, token }));
});

app.post("/api/logout", authenticateToken, (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
});

app.get("/api/me", authenticateToken, (req, res) => {
    let user = req.user.username;
    let token = req.cookies.token;
    res.status(200).send(JSON.stringify({ user, token }));
});

app.get('/api/test', authenticateToken, async (req, res) => {
    res.status(200).send('works!');
})

// Frontend
app.use("/", express.static("../frontend/dist/"));

app.listen(apiPort, () => {
    console.log(`Server started on port http://localhost:${apiPort}/`);
})