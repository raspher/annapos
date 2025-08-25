import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../components/Auth.jsx', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(false),
  }),
}));

import LoginPage from '../pages/LoginPage.jsx';

describe('LoginPage', () => {
  it('shows error on invalid credentials (erroneous data)', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'x@x' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    const err = await screen.findByText(/Invalid email or password/i);
    expect(err).toBeInTheDocument();
  });
});
