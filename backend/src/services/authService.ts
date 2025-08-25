import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../shared/config.ts';
import dataSource from "../db/dataSource.ts";
import { User } from "../db/entities/User.ts";

export interface LoginResult {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResult | null> {
  const user = await dataSource.manager.findOne(User, { where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const token = jwt.sign({ username: user.name }, config.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
}
