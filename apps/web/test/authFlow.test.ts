import { describe, expect, it } from 'vitest';

import { resolveRecoverySession, resolveResetRequest, resolveSignup } from '../lib/authFlow';
import { normalizeAuthErrorMessage } from '../lib/authMessages';

describe('auth flow helpers', () => {
  it('treats signup with session as signed in', () => {
    expect(resolveSignup({ session: { user: { id: 'u1' } } }).status).toBe('signed_in');
  });

  it('treats signup without session as confirmation required', () => {
    expect(resolveSignup({ session: null }).status).toBe('confirmation_required');
  });

  it('normalizes signup already-registered errors', () => {
    const result = resolveSignup({ session: null, errorMessage: 'User already registered' });
    expect(result.status).toBe('error');
    if (result.status === 'error') {
      expect(result.message).toMatch(/already exists/i);
    }
  });

  it('accepts reset request even when user is not found', () => {
    expect(resolveResetRequest({ errorMessage: 'User not found' }).status).toBe('sent');
  });

  it('returns error for reset request non-enumeration unrelated errors', () => {
    const result = resolveResetRequest({ errorMessage: 'Email rate limit exceeded' });
    expect(result.status).toBe('error');
  });

  it('treats recovery session as ready when session exists', () => {
    expect(resolveRecoverySession({ hasSession: true }).status).toBe('ready');
  });

  it('treats missing recovery session as invalid/expired', () => {
    const result = resolveRecoverySession({ hasSession: false });
    expect(result.status).toBe('error');
    if (result.status === 'error') {
      expect(result.message).toMatch(/invalid or expired/i);
    }
  });

  it('normalizes invalid login credentials', () => {
    expect(normalizeAuthErrorMessage('Invalid login credentials')).toMatch(
      /invalid email or password/i,
    );
  });
});
