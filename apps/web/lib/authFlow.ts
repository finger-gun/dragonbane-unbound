import { isNonEnumeratingResetRequestError, normalizeAuthErrorMessage } from './authMessages';

export type SignupResolution =
  | { status: 'signed_in' }
  | { status: 'confirmation_required' }
  | { status: 'error'; message: string };

export const resolveSignup = (input: {
  session: unknown;
  errorMessage?: string | null;
}): SignupResolution => {
  if (input.errorMessage) {
    return { status: 'error', message: normalizeAuthErrorMessage(input.errorMessage) };
  }

  if (input.session) {
    return { status: 'signed_in' };
  }

  return { status: 'confirmation_required' };
};

export type ResetRequestResolution = { status: 'sent' } | { status: 'error'; message: string };

export const resolveResetRequest = (input: {
  errorMessage?: string | null;
}): ResetRequestResolution => {
  if (!input.errorMessage) {
    return { status: 'sent' };
  }

  if (isNonEnumeratingResetRequestError(input.errorMessage)) {
    return { status: 'sent' };
  }

  return { status: 'error', message: normalizeAuthErrorMessage(input.errorMessage) };
};

export type RecoverySessionResolution = { status: 'ready' } | { status: 'error'; message: string };

export const resolveRecoverySession = (input: {
  hasSession: boolean;
  errorMessage?: string | null;
}) => {
  if (input.errorMessage) {
    return {
      status: 'error',
      message: normalizeAuthErrorMessage(input.errorMessage),
    } satisfies RecoverySessionResolution;
  }

  if (input.hasSession) {
    return { status: 'ready' } satisfies RecoverySessionResolution;
  }

  return {
    status: 'error',
    message:
      'This password reset link is invalid or expired. Request a new reset link to continue.',
  } satisfies RecoverySessionResolution;
};
