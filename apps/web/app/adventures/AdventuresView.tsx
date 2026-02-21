'use client';

import { useEffect, useMemo, useState } from 'react';

import { getSupabaseClient } from '../../lib/supabaseClient';

type AdventureRow = {
  id: string;
  name: string;
  join_code?: string;
  created_by?: string;
  created_at?: string;
};

type AdventureListEntry = {
  role: string;
  adventure: AdventureRow;
};

export default function AdventuresView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [adventures, setAdventures] = useState<AdventureListEntry[]>([]);

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);

  const isGm = useMemo(() => roles.includes('game-master'), [roles]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError('You must be signed in to view adventures.');
        setAdventures([]);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const meResponse = await fetch(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = meResponse.ok
        ? ((await meResponse.json()) as { roles?: string[] })
        : { roles: [] };
      setRoles(me.roles ?? []);

      const response = await fetch(`${apiUrl}/adventures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to load adventures.');
      }

      const payload = (await response.json()) as { adventures?: AdventureListEntry[] };
      setAdventures(payload.adventures ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setAdventures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      const name = createName.trim();
      if (!name) throw new Error('Adventure name is required.');

      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('You must be signed in.');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/adventures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to create adventure.');
      }

      setCreateName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    setBusy(true);
    setError(null);
    try {
      const code = joinCode.trim().toUpperCase();
      if (!code) throw new Error('Join code is required.');

      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('You must be signed in.');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/adventures/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ join_code: code }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to join adventure.');
      }

      setJoinCode('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Adventures</h1>
          <p className="page-subtitle">Campaign sessions you can run and join.</p>
        </div>
        <a className="button secondary" href="/">
          Back to home
        </a>
      </header>

      {loading ? <p className="page-subtitle">Loading adventures...</p> : null}
      {error ? <p className="help-text">{error}</p> : null}

      <section className="panel">
        <h2>Join an adventure</h2>
        <div className="form-grid two">
          <label className="field">
            Join code
            <input
              className="input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </label>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="button" type="button" onClick={handleJoin} disabled={busy}>
              Join
            </button>
          </div>
        </div>
      </section>

      {isGm ? (
        <section className="panel">
          <h2>Create an adventure</h2>
          <div className="form-grid two">
            <label className="field">
              Adventure name
              <input
                className="input"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
            </label>
            <div className="field" style={{ alignSelf: 'end' }}>
              <button
                className="button secondary"
                type="button"
                onClick={handleCreate}
                disabled={busy}
              >
                Create
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <h2>Your adventures</h2>
        {adventures.length === 0 ? <p className="page-subtitle">No adventures yet.</p> : null}
        <div className="card-grid">
          {adventures.map((entry) => (
            <article key={entry.adventure.id} className="card">
              <h2>{entry.adventure.name}</h2>
              <p className="page-subtitle">Role: {entry.role}</p>
              <div className="meta">
                <a className="cta" href={`/adventures/${entry.adventure.id}`}>
                  Open
                </a>
                {entry.adventure.join_code ? (
                  <span className="pill">Code: {entry.adventure.join_code}</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
