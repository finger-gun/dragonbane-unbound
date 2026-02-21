'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getSupabaseClient } from '../../lib/supabaseClient';
import { resolveSignup } from '../../lib/authFlow';

type SignupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'confirmation_required' }
  | { status: 'signed_in' };

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<SignupState>({ status: 'idle' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: 'loading' });

    const supabase = getSupabaseClient();
    const redirectTo = `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    const resolution = resolveSignup({ session: data.session, errorMessage: error?.message });
    if (resolution.status === 'error') {
      setState({ status: 'error', message: resolution.message });
      return;
    }
    if (resolution.status === 'signed_in') {
      setState({ status: 'signed_in' });
      router.push('/');
      return;
    }

    setState({ status: 'confirmation_required' });
  };

  const isLoading = state.status === 'loading';

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Supabase Auth</span>
        <h1>Create account</h1>
        <p className="lede">Sign up with your email and password.</p>
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
          <label className="field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </label>

          <button className="cta" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>

          {state.status === 'error' ? <p className="form-message">{state.message}</p> : null}

          {state.status === 'confirmation_required' ? (
            <p className="form-message">
              Account created. Check your email to confirm your address, then{' '}
              <a href="/login">sign in</a>.
            </p>
          ) : null}

          {state.status === 'signed_in' ? (
            <p className="form-message">Account created. Redirecting…</p>
          ) : null}

          <p className="form-message">
            Already have an account? <a href="/login">Sign in</a>.
          </p>
        </form>
      </section>
    </main>
  );
}
