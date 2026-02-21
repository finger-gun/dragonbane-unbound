'use client';

import { useEffect, useState } from 'react';

import { getSupabaseClient } from '../../lib/supabaseClient';
import { normalizeAuthErrorMessage } from '../../lib/authMessages';
import { resolveRecoverySession } from '../../lib/authFlow';

type UpdatePasswordState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string }
  | { status: 'saving' }
  | { status: 'saved' };

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [state, setState] = useState<UpdatePasswordState>({ status: 'loading' });

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        const resolution = resolveRecoverySession({
          hasSession: false,
          errorMessage: error.message,
        });
        if (resolution.status === 'error') {
          setState({ status: 'error', message: resolution.message });
        } else {
          setState({ status: 'ready' });
        }
        return;
      }

      const resolution = resolveRecoverySession({ hasSession: Boolean(data.session) });
      if (resolution.status === 'error') {
        setState({ status: 'error', message: resolution.message });
        return;
      }

      setState({ status: 'ready' });
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: 'saving' });

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setState({ status: 'error', message: normalizeAuthErrorMessage(error.message) });
      return;
    }

    setState({ status: 'saved' });
  };

  const isSaving = state.status === 'saving';

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Supabase Auth</span>
        <h1>Set new password</h1>
        <p className="lede">Choose a new password for your account.</p>
      </section>

      <section className="card">
        {state.status === 'loading' ? <p className="form-message">Checking reset link…</p> : null}

        {state.status === 'error' ? (
          <>
            <p className="form-message">{state.message}</p>
            <p className="form-message">
              <a href="/forgot-password">Request a new reset link</a>
            </p>
            <p className="form-message">
              <a href="/login">Back to sign in</a>
            </p>
          </>
        ) : null}

        {state.status === 'ready' || state.status === 'saving' || state.status === 'saved' ? (
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              New password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </label>

            <button className="cta" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Update password'}
            </button>

            {state.status === 'saved' ? (
              <p className="form-message">
                Password updated. <a href="/login">Sign in</a> with your new password.
              </p>
            ) : null}
          </form>
        ) : null}
      </section>
    </main>
  );
}
