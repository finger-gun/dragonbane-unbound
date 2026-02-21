'use client';

import { useEffect, useMemo, useState } from 'react';

import type { CharacterRecord, CharacterSheet } from '@dbu/types';

import { getSupabaseClient } from '../../lib/supabaseClient';

type CharacterListItem = {
  id: string;
  updated_at?: string;
  header: CharacterSheet['header'];
};

const formatDate = (value: string | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toLocaleString();
};

export default function CharacterLibraryView() {
  const [items, setItems] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''));
  }, [items]);

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setError('You must be signed in to view your characters.');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/characters`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? 'Unable to load characters.');
        }

        const payload = (await response.json()) as { characters?: CharacterRecord[] };
        const list = (payload.characters ?? []).map((record) => ({
          id: record.id,
          updated_at: record.updated_at,
          header: record.data.header,
        }));

        setItems(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="page-subtitle">Loading characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1 className="page-title">Characters</h1>
            <p className="page-subtitle">Your character library</p>
          </div>
          <a className="button secondary" href="/characters/new">
            New character
          </a>
        </header>
        <section className="panel">
          <p className="help-text">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Characters</h1>
          <p className="page-subtitle">Your character library</p>
        </div>
        <div className="meta">
          <a className="button secondary" href="/">
            Back to home
          </a>
          <a className="button" href="/characters/new">
            New character
          </a>
        </div>
      </header>

      <section className="panel">
        {sorted.length === 0 ? (
          <p className="page-subtitle">No characters yet. Create one to get started.</p>
        ) : (
          <div className="card-grid">
            {sorted.map((character) => (
              <article key={character.id} className="card">
                <h2>{character.header.character_name}</h2>
                <p>
                  {character.header.kin} · {character.header.profession} · {character.header.age}
                </p>
                <p className="page-subtitle">Updated: {formatDate(character.updated_at)}</p>
                <div className="meta">
                  <a className="cta" href={`/characters/${character.id}`}>
                    Open
                  </a>
                  <a className="cta" href={`/characters/${character.id}/edit`}>
                    Edit
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
