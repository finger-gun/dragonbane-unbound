'use client';

import { useState } from 'react';

import { getSupabaseClient } from '../../lib/supabaseClient';
import { resolveResetRequest } from '../../lib/authFlow';

type ForgotPasswordState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'sent' }
  | { status: 'error'; message: string };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ForgotPasswordState>({ status: 'idle' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: 'loading' });

    const supabase = getSupabaseClient();
    const redirectTo = `${window.location.origin}/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    const resolution = resolveResetRequest({ errorMessage: error?.message });
    if (resolution.status === 'sent') {
      setState({ status: 'sent' });
      return;
    }

    setState({ status: 'error', message: resolution.message });
  };

  const isLoading = state.status === 'loading';

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Supabase Auth</span>
        <h1>Reset password</h1>
        <p className="lede">We’ll email you a link to set a new password.</p>
      </section>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <button className="cta" type="submit" disabled={isLoading}>
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </button>

          {state.status === 'sent' ? (
            <p className="form-message">
              If an account exists for that email, you’ll receive a reset link shortly.
            </p>
          ) : null}

          {state.status === 'error' ? <p className="form-message">{state.message}</p> : null}

          <p className="form-message">
            <a href="/login">Back to sign in</a>
          </p>
        </form>
      </section>
    </main>
  );
}
