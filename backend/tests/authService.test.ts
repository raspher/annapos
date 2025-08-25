import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../src/shared/config.ts', () => ({
  default: {
    JWT_SECRET: 'testsecret',
    API_PORT: '8080',
    PROFILE: 'DEV',
    POSTGRES_USER: 'u',
    POSTGRES_PASSWORD: 'p',
    POSTGRES_DB: 'd',
    POSTGRES_PORT: '5432',
    POSTGRES_HOST: 'localhost',
  },
}));

vi.mock('../src/repositories/userRepository.ts', () => ({
  default: {
    findByEmail: vi.fn(),
  },
}));

import userRepository from '../src/repositories/userRepository.ts';
import * as authService from '../src/services/authService.ts';
import bcrypt from 'bcryptjs';

vi.mock('bcryptjs');

describe('authService.login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns token and user for valid credentials', async () => {
    (userRepository.findByEmail as any).mockResolvedValue({ id: 1, name: 'Admin', password: 'hashed' });
    (bcrypt.compare as any) = vi.fn().mockResolvedValue(true);

    const res = await authService.login('admin@admin.pl', 'changeme');
    expect(res).not.toBeNull();
    expect(res?.user.name).toBe('Admin');
    expect(res?.token).toBeTruthy();
  });

  it('returns null for non-existent user', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(null);
    const res = await authService.login('no@user', 'x');
    expect(res).toBeNull();
  });

  it('returns null for wrong password', async () => {
    (userRepository.findByEmail as any).mockResolvedValue({ id: 1, name: 'Admin', password: 'hashed' });
    (bcrypt.compare as any) = vi.fn().mockResolvedValue(false);

    const res = await authService.login('admin@admin.pl', 'wrong');
    expect(res).toBeNull();
  });
});
