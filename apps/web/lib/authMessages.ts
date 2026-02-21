export const normalizeAuthErrorMessage = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (
    lower.includes('user already registered') ||
    (lower.includes('already') && lower.includes('registered'))
  ) {
    return 'An account with that email already exists. Try signing in instead.';
  }

  return message;
};

export const isNonEnumeratingResetRequestError = (message: string) => {
  const lower = message.toLowerCase();
  return lower.includes('user not found');
};
