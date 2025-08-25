import { Request, Response } from 'express';
import { login as loginService } from '../services/authService.ts';
import { authenticateToken } from '../routes/middleware.ts';

const getCookieOptions = {
  httpOnly: true,
  secure: process.env.Target === 'prod' || false,
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 60, // 1h
};

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const result = await loginService(email, password);
  if (!result) return res.status(401).send('Invalid credentials');
  res.cookie('token', result.token, getCookieOptions);
  res.status(200).send(JSON.stringify({ user: result.user, token: result.token }));
}

export function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
}

export function cookie(req: Request, res: Response) {
  const user = (req as any).user?.username;
  const token = (req as any).cookies?.token;
  res.status(200).send(JSON.stringify({ user, token }));
}
