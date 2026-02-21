'use client';

import { useEffect, useMemo, useState } from 'react';

import type { CharacterRecord } from '@dbu/types';

import { getSupabaseClient } from '../../../lib/supabaseClient';

type AdventureDetailViewProps = {
  id: string;
};

type AdventureDetailPayload = {
  adventure: { id: string; name: string; join_code?: string };
  membership: { role: string };
  members: Array<{ user_id: string; role: string }>;
  roster: Array<{
    link: {
      character_id: string;
      owner_user_id: string;
      status: 'active' | 'completed';
      completed_at?: string | null;
    };
    character: { id: string; header?: any; user_id?: string } | null;
  }>;
};

export default function AdventureDetailView({ id }: AdventureDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdventureDetailPayload | null>(null);
  const [myCharacters, setMyCharacters] = useState<CharacterRecord[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const [working, setWorking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      setCurrentUserId(data.session?.user?.id ?? null);
      if (!token) {
        setError('You must be signed in to view this adventure.');
        setDetail(null);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/adventures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to load adventure.');
      }
      const payload = (await response.json()) as AdventureDetailPayload;
      setDetail(payload);

      const charactersResponse = await fetch(`${apiUrl}/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (charactersResponse.ok) {
        const charactersPayload = (await charactersResponse.json()) as {
          characters?: CharacterRecord[];
        };
        setMyCharacters(charactersPayload.characters ?? []);
      } else {
        setMyCharacters([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const rosterCharacterIds = useMemo(() => {
    return new Set((detail?.roster ?? []).map((entry) => entry.link.character_id));
  }, [detail]);

  const availableToAdd = useMemo(() => {
    return myCharacters.filter((character) => !rosterCharacterIds.has(character.id));
  }, [myCharacters, rosterCharacterIds]);

  const handleAdd = async () => {
    if (!selectedCharacterId) return;
    setWorking(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Not signed in.');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/adventures/${id}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ character_id: selectedCharacterId, status: 'active' }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to add character.');
      }

      setSelectedCharacterId('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setWorking(false);
    }
  };

  const handleSetStatus = async (characterId: string, status: 'active' | 'completed') => {
    setWorking(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Not signed in.');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

      const response = await fetch(`${apiUrl}/adventures/${id}/characters/${characterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to update status.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setWorking(false);
    }
  };

  const handleRemove = async (characterId: string) => {
    if (!confirm('Remove this character from the adventure?')) return;
    setWorking(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Not signed in.');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

      const response = await fetch(`${apiUrl}/adventures/${id}/characters/${characterId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to remove character.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="page-subtitle">Loading adventure...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1 className="page-title">Adventure</h1>
            <p className="page-subtitle">{error ?? 'Not found.'}</p>
          </div>
          <a className="button secondary" href="/adventures">
            Back
          </a>
        </header>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">{detail.adventure.name}</h1>
          <p className="page-subtitle">Your role: {detail.membership.role}</p>
          {detail.membership.role === 'game-master' && detail.adventure.join_code ? (
            <p className="page-subtitle">Join code: {detail.adventure.join_code}</p>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="button secondary" href="/adventures">
            Adventures
          </a>
          <a className="button secondary" href="/characters">
            Characters
          </a>
        </div>
      </header>

      {error ? <p className="help-text">{error}</p> : null}

      <section className="panel">
        <h2>Members</h2>
        <div className="summary-grid">
          {detail.members.map((member) => (
            <div key={`${member.user_id}:${member.role}`} className="summary-card">
              <strong>{member.role}</strong>
              <div className="summary-list">
                <span>{member.user_id}</span>
                <span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Characters in this adventure</h2>
        {detail.roster.length === 0 ? (
          <p className="page-subtitle">No characters linked yet.</p>
        ) : null}
        <div className="summary-grid">
          {detail.roster.map((entry) => {
            const name = entry.character?.header?.character_name ?? entry.link.character_id;
            const isMine = Boolean(currentUserId && entry.link.owner_user_id === currentUserId);
            return (
              <div key={entry.link.character_id} className="summary-card">
                <strong>{name}</strong>
                <div className="summary-list">
                  <span>Status: {entry.link.status}</span>
                  <span>Owner: {entry.link.owner_user_id}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a className="button secondary" href={`/characters/${entry.link.character_id}`}>
                    Open
                  </a>
                  {isMine ? (
                    <>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleSetStatus(entry.link.character_id, 'active')}
                        disabled={working}
                      >
                        Mark active
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleSetStatus(entry.link.character_id, 'completed')}
                        disabled={working}
                      >
                        Mark completed
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleRemove(entry.link.character_id)}
                        disabled={working}
                      >
                        Remove
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <h3>Add your character</h3>
        <div className="form-grid two">
          <label className="field">
            Character
            <select
              className="select"
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
            >
              <option value="">Select...</option>
              {availableToAdd.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.data.header.character_name} ({character.data.header.profession})
                </option>
              ))}
            </select>
          </label>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button
              className="button"
              type="button"
              onClick={handleAdd}
              disabled={working || !selectedCharacterId}
            >
              Add
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
