type SupabaseAuthClient = {
  auth: {
    signUp: (input: {
      email: string;
      password: string;
      options?: { emailRedirectTo?: string };
    }) => Promise<{ data: { session: unknown }; error: { message: string } | null }>;
    resetPasswordForEmail: (
      email: string,
      options: { redirectTo: string },
    ) => Promise<{ error: { message: string } | null }>;
    updateUser: (input: { password: string }) => Promise<{ error: { message: string } | null }>;
  };
};

export const signUpWithEmailPassword = async (
  client: SupabaseAuthClient,
  input: {
    email: string;
    password: string;
    emailRedirectTo: string;
  },
) => {
  return client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.emailRedirectTo,
    },
  });
};

export const requestPasswordReset = async (
  client: SupabaseAuthClient,
  input: {
    email: string;
    redirectTo: string;
  },
) => {
  return client.auth.resetPasswordForEmail(input.email, { redirectTo: input.redirectTo });
};

export const updatePassword = async (client: SupabaseAuthClient, input: { password: string }) => {
  return client.auth.updateUser({ password: input.password });
};
