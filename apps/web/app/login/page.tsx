'use client';

import { useState } from 'react';

import { getSupabaseClient } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signed in successfully.');
    }

    setLoading(false);
  };

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Supabase Auth</span>
        <h1>Sign in</h1>
        <p className="lede">Use your email and password to access Dragonbane Unbound.</p>
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
            />
          </label>
          <button className="cta" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
