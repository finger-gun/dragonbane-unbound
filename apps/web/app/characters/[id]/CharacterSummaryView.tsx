'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import type { CharacterSheet, KinRef } from '@dbu/types';

import PortraitImage from '../../components/PortraitImage';

const derivePortrait = (sheet: CharacterSheet) => {
  if (sheet.portrait) return sheet.portrait;
  if (sheet.header.kin_id)
    return { kind: 'kin' as const, kin_ref: `core:${sheet.header.kin_id}` as KinRef };
  return null;
};

type CharacterAdventureLink = {
  link: { status?: string };
  adventure: { id: string; name: string } | null;
};

type CharacterSummaryViewProps = {
  id: string;
};

export default function CharacterSummaryView({ id }: CharacterSummaryViewProps) {
  const [character, setCharacter] = useState<CharacterSheet | null>(null);
  const [adventures, setAdventures] = useState<CharacterAdventureLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setError('You must be signed in to view this character.');
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/characters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? 'Unable to load character.');
        }

        const payload = (await response.json()) as { character?: { data?: CharacterSheet } };
        if (!payload.character?.data) {
          throw new Error('Character data missing.');
        }

        setCharacter(payload.character.data);

        const adventuresResponse = await fetch(`${apiUrl}/characters/${id}/adventures`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (adventuresResponse.ok) {
          const adventuresPayload = (await adventuresResponse.json()) as {
            adventures?: CharacterAdventureLink[];
          };
          setAdventures(adventuresPayload.adventures ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p className="page-subtitle">Loading character...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="page">
        <p className="page-subtitle">{error ?? 'Character not found.'}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <PortraitImage
            portrait={derivePortrait(character)}
            alt={character.header.character_name}
            size={84}
          />
          <div>
            <h1 className="page-title">{character.header.character_name}</h1>
            <p className="page-subtitle">
              {character.header.kin} · {character.header.profession} · {character.header.age}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="button secondary" href="/characters">
            Character library
          </a>
          <a className="button secondary" href={`/characters/${id}/edit`}>
            Edit
          </a>
          <a className="button secondary" href="/characters/new">
            New character
          </a>
        </div>
      </header>

      <section className="panel">
        <h2>Adventures</h2>
        {adventures.length === 0 ? (
          <p className="page-subtitle">Not associated with any adventures yet.</p>
        ) : (
          <div className="summary-grid">
            {adventures.map((entry, index) => (
              <a
                key={`${entry.adventure?.id ?? 'missing'}-${index}`}
                className="summary-card"
                href={entry.adventure ? `/adventures/${entry.adventure.id}` : '#'}
              >
                <strong>{entry.adventure?.name ?? 'Unknown adventure'}</strong>
                <div className="summary-list">
                  <span>Status: {entry.link?.status ?? 'unknown'}</span>
                  <span />
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Attributes</h2>
        <div className="stat-grid">
          {Object.entries(character.attributes).map(([key, value]) => (
            <div key={key} className="stat-card">
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Derived Ratings</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <span>HP</span>
            <strong>
              {character.hit_points.current}/{character.hit_points.max}
            </strong>
          </div>
          <div className="stat-card">
            <span>WP</span>
            <strong>
              {character.willpower_points.current}/{character.willpower_points.max}
            </strong>
          </div>
          <div className="stat-card">
            <span>Movement</span>
            <strong>{character.derived_ratings.movement}</strong>
          </div>
          <div className="stat-card">
            <span>Damage Bonus STR</span>
            <strong>{character.derived_ratings.damage_bonus_str ?? 'None'}</strong>
          </div>
          <div className="stat-card">
            <span>Damage Bonus AGL</span>
            <strong>{character.derived_ratings.damage_bonus_agl ?? 'None'}</strong>
          </div>
          <div className="stat-card">
            <span>Carry Slots</span>
            <strong>{character.derived_ratings.carrying_capacity}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Skills</h2>
        <div className="summary-grid">
          {character.skills.map((skill) => (
            <div key={skill.id} className="summary-card">
              <strong>{skill.name}</strong>
              <div className="summary-list">
                <span>
                  {skill.value} · {skill.trained ? 'Trained' : 'Base'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
