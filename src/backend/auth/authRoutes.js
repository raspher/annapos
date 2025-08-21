import {Router} from 'express';
import {config} from "../shared/config.js";
import {authenticateToken} from "../shared/middleware.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from "./userRepository.js";

const router = Router();

function createJwtToken(user) {
    return jwt.sign({username: user.username}, config.JWT_SECRET, {expiresIn: '1h'});
}

const getCookieOptions = {
    httpOnly: true,
    secure: process.env.Target === "prod" || false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60, // 1h
};

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await userRepository.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = createJwtToken(user);
    res.cookie("token", token, getCookieOptions);
    res.status(200).send(JSON.stringify({user, token}));
});

router.post("/logout", authenticateToken, (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logged out"});
});

router.get("/cookie", authenticateToken, (req, res) => {
    let user = req.user.username;
    let token = req.cookies.token;
    res.status(200).send(JSON.stringify({user, token}));
});

router.get("/refresh", authenticateToken, (req, res) => {
    const token = createJwtToken(req.user);
    res.cookie("token", token, getCookieOptions);
    let userName = req.user.username;
    res.status(200).send(JSON.stringify({user: userName, token}));
})

export default router;