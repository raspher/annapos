import 'reflect-metadata';
import Router, { Request, Response } from 'express';
import config from '../shared/config.ts';
import { authenticateToken} from './middleware.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dataSource from "../db/dataSource.ts";
import {User} from "../db/entities/User.ts";
import {AuthPayload} from "../types/AuthPayload.ts";

const router = Router();

interface IUser {
  id: number;
  username: string;
  password: string;
}

function createJwtToken(username: string) {
  return jwt.sign({ username: username }, config.JWT_SECRET, { expiresIn: '1h' });
}

const getCookieOptions = {
  httpOnly: true,
  secure: process.env.Target === 'prod' || false,
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 60, // 1h
};

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = (await dataSource.manager.findOne(User, { where: { email: email } }));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = createJwtToken(user.name);
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

export default router;
