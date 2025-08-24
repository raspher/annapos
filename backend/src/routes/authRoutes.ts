import Router, { Request, Response } from 'express';
import config from '../shared/config.js';
import { authenticateToken} from './middleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../db/repositories/userRepository.js';
import {AuthPayload} from "../types/AuthPayload.js";

const router = Router();

interface User {
  id: number;
  username: string;
  password: string;
}

function createJwtToken(user: { username: string }) {
  return jwt.sign({ username: user.username }, config.JWT_SECRET, { expiresIn: '1h' });
}

const getCookieOptions = {
  httpOnly: true,
  secure: process.env.Target === 'prod' || false,
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 60, // 1h
};

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = (await userRepository.findOne({ where: { email } })) as unknown as User | null;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = createJwtToken(user);
  res.cookie('token', token, getCookieOptions);
  res.status(200).send(JSON.stringify({ user, token }));
});

router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
});

router.get('/cookie', authenticateToken, (req: Request, res: Response) => {
    let user = (req as Request & { user: AuthPayload }).user.username;
    let token = req.cookies.token;
    res.status(200).send(JSON.stringify({user, token}));
});

router.get('/refresh', authenticateToken, (req: Request, res: Response) => {
    const token = createJwtToken((req as Request & { user: AuthPayload }).user);
    res.cookie("token", token, getCookieOptions);
    let userName = (req as Request & { user: AuthPayload }).user.username;
    res.status(200).send(JSON.stringify({user: userName, token}));
});

export default router;
