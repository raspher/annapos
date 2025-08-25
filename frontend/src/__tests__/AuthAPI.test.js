import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthAPI } from '../services/api.js';

const originalFetch = global.fetch;

describe('AuthAPI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('login returns user and token on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ user: { name: 'Admin' }, token: 'abc' }),
      text: async () => JSON.stringify({ user: { name: 'Admin' }, token: 'abc' }),
    });

    const res = await AuthAPI.login('a@a', 'p');
    expect(res.user).toBe('Admin');
    expect(res.accessToken).toBe('abc');
  });

  it('login throws on 401 (erroneous data)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Invalid credentials' }),
      text: async () => 'Invalid credentials',
    });

    await expect(AuthAPI.login('bad', 'creds')).rejects.toThrow('Invalid credentials');
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});
