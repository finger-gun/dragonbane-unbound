import { describe, expect, it, vi } from 'vitest';

import { requestPasswordReset, signUpWithEmailPassword, updatePassword } from '../lib/authActions';

describe('auth actions', () => {
  it('signUpWithEmailPassword passes emailRedirectTo', async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { session: null }, error: null });
    const client = { auth: { signUp, resetPasswordForEmail: vi.fn(), updateUser: vi.fn() } };

    await signUpWithEmailPassword(client, {
      email: 'a@b.com',
      password: 'pw',
      emailRedirectTo: 'http://localhost/login',
    });

    expect(signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pw',
      options: { emailRedirectTo: 'http://localhost/login' },
    });
  });

  it('requestPasswordReset passes redirectTo', async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
    const client = { auth: { signUp: vi.fn(), resetPasswordForEmail, updateUser: vi.fn() } };

    await requestPasswordReset(client, {
      email: 'a@b.com',
      redirectTo: 'http://localhost/update-password',
    });

    expect(resetPasswordForEmail).toHaveBeenCalledWith('a@b.com', {
      redirectTo: 'http://localhost/update-password',
    });
  });

  it('updatePassword calls updateUser with password', async () => {
    const updateUser = vi.fn().mockResolvedValue({ error: null });
    const client = { auth: { signUp: vi.fn(), resetPasswordForEmail: vi.fn(), updateUser } };

    await updatePassword(client, { password: 'new-password' });

    expect(updateUser).toHaveBeenCalledWith({ password: 'new-password' });
  });
});
