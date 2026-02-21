'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Encounter } from '@dbu/types';

import { getSupabaseClient } from '../../../lib/supabaseClient';

type EncounterTrackerProps = {
  id: string;
};

export default function EncounterTracker({ id }: EncounterTrackerProps) {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logMessage, setLogMessage] = useState('');

  const activeParticipant = useMemo(() => {
    if (!encounter) return null;
    return encounter.participants[encounter.turn_index] ?? null;
  }, [encounter]);

  const fetchEncounter = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setError('You must be signed in to view this encounter.');
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/encounters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      throw new Error(payload.error ?? 'Unable to load encounter.');
    }

    const payload = (await response.json()) as { encounter?: { data?: Encounter } };
    if (!payload.encounter?.data) {
      throw new Error('Encounter data missing.');
    }

    setEncounter(payload.encounter.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchEncounter();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const advanceTurn = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/encounters/${id}/advance`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to advance turn.');
      }

      const payload = (await response.json()) as { encounter?: { data?: Encounter } };
      if (payload.encounter?.data) {
        setEncounter(payload.encounter.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    }
  };

  const addLogEntry = async () => {
    if (!logMessage) return;
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/encounters/${id}/logs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: logMessage,
          actor_id: activeParticipant?.id ?? null,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to log entry.');
      }

      const payload = (await response.json()) as { encounter?: { data?: Encounter } };
      if (payload.encounter?.data) {
        setEncounter(payload.encounter.data);
        setLogMessage('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="page-subtitle">Loading encounter...</p>
      </div>
    );
  }

  if (error || !encounter) {
    return (
      <div className="page">
        <p className="page-subtitle">{error ?? 'Encounter not found.'}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">{encounter.name}</h1>
          <p className="page-subtitle">
            Round {encounter.round} · Active: {activeParticipant?.name ?? 'None'}
          </p>
        </div>
        <a className="button secondary" href="/encounters/new">
          New encounter
        </a>
      </header>

      <section className="panel">
        <h2>Initiative Order</h2>
        <div className="summary-grid">
          {encounter.participants.map((participant, index) => (
            <div
              key={participant.id}
              className={`summary-card ${index === encounter.turn_index ? 'highlight' : ''}`}
            >
              <strong>{participant.name}</strong>
              <div className="summary-list">
                <span>Initiative: {participant.initiative}</span>
                <span>{participant.is_player ? 'Player' : 'NPC'}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="button" type="button" onClick={advanceTurn}>
          Next turn
        </button>
      </section>

      <section className="panel">
        <h2>Combat Log</h2>
        <div className="form-grid">
          <label className="field">
            New entry
            <textarea
              className="textarea"
              value={logMessage}
              onChange={(event) => setLogMessage(event.target.value)}
              placeholder="Describe the action, damage, or narrative beat."
            />
          </label>
          <button className="button" type="button" onClick={addLogEntry}>
            Add log entry
          </button>
        </div>
        <div className="log-list">
          {encounter.log.map((entry) => (
            <div key={entry.id} className="log-item">
              <strong>{new Date(entry.timestamp).toLocaleString()}</strong>
              <span>{entry.message}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
