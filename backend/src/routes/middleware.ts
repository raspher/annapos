import jwt from 'jsonwebtoken';
import xss from 'xss';
import config from '../shared/config.js';
import { NextFunction, Request, Response } from 'express';
import {AuthPayload} from "../types/AuthPayload.js";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.token as string | undefined;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

const sanitize = (obj: unknown): any => {
  if (typeof obj === 'string') return xss(obj);
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj as Record<string, unknown>) {
      (obj as any)[key] = sanitize((obj as any)[key]);
    }
  }
  return obj;
};

export function sanitizer(req: Request, res: Response, next: NextFunction) {
  (req as any).body = sanitize(req.body);

  for (const key of Object.keys(req.query)) {
    (req.query as any)[key] = sanitize((req.query as any)[key]);
  }

  for (const key of Object.keys(req.params)) {
    (req.params as any)[key] = sanitize((req.params as any)[key]);
  }

  next();
}
