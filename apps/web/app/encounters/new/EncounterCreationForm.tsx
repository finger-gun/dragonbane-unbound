'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getSupabaseClient } from '../../../lib/supabaseClient';
import type { CharacterRecord } from '@dbu/types';

type ParticipantInput = {
  name: string;
  initiative: number;
  is_player: boolean;
  character_id?: string | null;
};

export default function EncounterCreationForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { name: '', initiative: 10, is_player: true, character_id: null },
  ]);
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setCharacters([]);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
        const meResponse = await fetch(`${apiUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mePayload = meResponse.ok
          ? ((await meResponse.json()) as { roles?: string[] })
          : { roles: [] as string[] };

        const isGm = (mePayload.roles ?? []).includes('game-master');
        const url = new URL(`${apiUrl}/characters`);
        if (isGm) url.searchParams.set('scope', 'all');

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setCharacters([]);
          return;
        }

        const payload = (await response.json()) as { characters?: CharacterRecord[] };
        setCharacters(payload.characters ?? []);
      } catch {
        setCharacters([]);
      }
    };

    run();
  }, []);

  const updateParticipant = (index: number, update: Partial<ParticipantInput>) => {
    setParticipants((prev) =>
      prev.map((participant, current) =>
        current === index ? { ...participant, ...update } : participant,
      ),
    );
  };

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      { name: '', initiative: 10, is_player: false, character_id: null },
    ]);
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, current) => current !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!name) {
        setError('Encounter name is required.');
        setSaving(false);
        return;
      }

      if (!participants.some((participant) => participant.name || participant.character_id)) {
        setError('Add at least one participant.');
        setSaving(false);
        return;
      }

      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError('You must be signed in to save an encounter.');
        setSaving(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/encounters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          participants: participants
            .filter((participant) => participant.name.trim().length > 0 || participant.character_id)
            .map((participant) => ({
              name: participant.name,
              initiative: participant.initiative,
              is_player: participant.is_player,
              character_id: participant.character_id ?? null,
            })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to save encounter.');
      }

      const payload = (await response.json()) as { encounter?: { id: string } };
      if (payload.encounter?.id) {
        router.push(`/encounters/${payload.encounter.id}`);
      } else {
        throw new Error('Encounter saved but id missing.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setSaving(false);
      return;
    }
  };

  return (
    <div className="form-grid">
      <section className="panel">
        <h2>Encounter Details</h2>
        <div className="form-grid">
          <label className="field">
            Encounter name
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Participants</h2>
        <div className="form-grid">
          {participants.map((participant, index) => (
            <div key={`participant-${index}`} className="form-grid two">
              <label className="field">
                Character
                <select
                  className="select"
                  value={participant.character_id ?? ''}
                  onChange={(event) => {
                    const nextId = event.target.value || null;
                    const selected = characters.find((record) => record.id === nextId);
                    updateParticipant(index, {
                      character_id: nextId,
                      name: selected?.data?.header?.character_name ?? participant.name,
                      is_player: nextId ? true : participant.is_player,
                    });
                  }}
                >
                  <option value="">(No character)</option>
                  {characters.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.data.header.character_name} ({record.data.header.profession})
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Name
                <input
                  className="input"
                  value={participant.name}
                  disabled={Boolean(participant.character_id)}
                  onChange={(event) => updateParticipant(index, { name: event.target.value })}
                />
              </label>
              <label className="field">
                Initiative
                <input
                  className="input"
                  type="number"
                  value={participant.initiative}
                  onChange={(event) =>
                    updateParticipant(index, { initiative: Number(event.target.value) || 0 })
                  }
                />
              </label>
              <label className="field">
                Player character
                <select
                  className="select"
                  value={participant.is_player ? 'yes' : 'no'}
                  onChange={(event) =>
                    updateParticipant(index, { is_player: event.target.value === 'yes' })
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <button
                className="button secondary"
                type="button"
                onClick={() => removeParticipant(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button className="button secondary" type="button" onClick={addParticipant}>
          Add participant
        </button>
      </section>

      <section className="panel">
        <h2>Launch Encounter</h2>
        {error ? <p className="help-text">{error}</p> : null}
        <button className="button" type="button" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Create encounter'}
        </button>
      </section>
    </div>
  );
}
