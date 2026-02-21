'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { CharacterRecord, CharacterSheet, PackItemCatalogEntry } from '@dbu/types';

import ItemPicker from '../../../components/ItemPicker';

import { getSupabaseClient } from '../../../../lib/supabaseClient';

type CharacterEditViewProps = {
  id: string;
};

const conditionLabels: Record<keyof CharacterSheet['conditions'], string> = {
  exhausted: 'Exhausted',
  sickly: 'Sickly',
  dazed: 'Dazed',
  angry: 'Angry',
  scared: 'Scared',
  disheartened: 'Disheartened',
};

export default function CharacterEditView({ id }: CharacterEditViewProps) {
  const router = useRouter();
  const [record, setRecord] = useState<CharacterRecord | null>(null);
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showItemPicker, setShowItemPicker] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setError('You must be signed in to edit this character.');
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

        const payload = (await response.json()) as { character?: CharacterRecord };
        if (!payload.character?.data) {
          throw new Error('Character data missing.');
        }

        setRecord(payload.character);
        setSheet(payload.character.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const conditions = sheet?.conditions;
  const conditionKeys = useMemo(() => {
    if (!conditions) return [] as Array<keyof CharacterSheet['conditions']>;
    return Object.keys(conditions) as Array<keyof CharacterSheet['conditions']>;
  }, [conditions]);

  const updateSheet = (updater: (prev: CharacterSheet) => CharacterSheet) => {
    setSheet((prev) => (prev ? updater(prev) : prev));
  };

  const addFromCatalog = (item: PackItemCatalogEntry) => {
    updateSheet((prev) => {
      if (item.kind === 'weapon' && item.damage) {
        return {
          ...prev,
          weapons: [
            ...prev.weapons,
            {
              id: null,
              pack_id: item.pack_id,
              item_id: item.item_id,
              name: item.name,
              name_sv: item.name_sv ?? null,
              damage: item.damage,
            },
          ],
        };
      }

      if (item.kind === 'armor' && typeof item.protection === 'number') {
        const armorEntry = {
          id: undefined,
          pack_id: item.pack_id,
          item_id: item.item_id,
          name: item.name,
          name_sv: item.name_sv ?? undefined,
          protection: item.protection,
        };

        if (!prev.armor.body_armor) {
          return { ...prev, armor: { ...prev.armor, body_armor: armorEntry } };
        }
        if (!prev.armor.helmet) {
          return { ...prev, armor: { ...prev.armor, helmet: armorEntry } };
        }
        return { ...prev, armor: { ...prev.armor, body_armor: armorEntry } };
      }

      const nextSlot =
        prev.packing.length > 0 ? Math.max(...prev.packing.map((p) => p.slot)) + 1 : 1;
      return {
        ...prev,
        packing: [
          ...prev.packing,
          {
            slot: nextSlot,
            pack_id: item.pack_id,
            item_id: item.item_id,
            item: item.name,
            item_sv: item.name_sv ?? undefined,
          },
        ],
      };
    });

    setShowItemPicker(false);
  };

  const handleSave = async () => {
    if (!sheet) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        throw new Error('You must be signed in to save changes.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

      const runtimeResponse = await fetch(`${apiUrl}/characters/${id}/runtime`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conditions: sheet.conditions,
          hit_points: sheet.hit_points,
          willpower_points: sheet.willpower_points,
          currency: sheet.currency,
          weapons: sheet.weapons,
          armor: sheet.armor,
          packing: sheet.packing,
        }),
      });

      if (!runtimeResponse.ok) {
        const payload = (await runtimeResponse.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to save runtime changes.');
      }

      const identityResponse = await fetch(`${apiUrl}/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            ...sheet,
            // Ensure runtime data already saved stays consistent if the backend merges differently.
            conditions: sheet.conditions,
            hit_points: sheet.hit_points,
            willpower_points: sheet.willpower_points,
            currency: sheet.currency,
            weapons: sheet.weapons,
            armor: sheet.armor,
            packing: sheet.packing,
          },
        }),
      });

      if (!identityResponse.ok) {
        const payload = (await identityResponse.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to save character.');
      }

      const payload = (await identityResponse.json()) as { character?: CharacterRecord };
      if (payload.character?.data) {
        setRecord(payload.character);
        setSheet(payload.character.data);
      }

      router.push(`/characters/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setSaving(false);
      return;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this character? This cannot be undone.')) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        throw new Error('You must be signed in to delete this character.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/characters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to delete character.');
      }

      router.push('/characters');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setSaving(false);
      return;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="page-subtitle">Loading character...</p>
      </div>
    );
  }

  if (error || !sheet) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1 className="page-title">Edit character</h1>
            <p className="page-subtitle">{error ?? 'Character not found.'}</p>
          </div>
          <a className="button secondary" href="/characters">
            Back to library
          </a>
        </header>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Edit: {sheet.header.character_name}</h1>
          <p className="page-subtitle">
            {sheet.header.kin} · {sheet.header.profession} · {sheet.header.age}
          </p>
          {record?.updated_at ? (
            <p className="page-subtitle">
              Last updated: {new Date(record.updated_at).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="button secondary" href={`/characters/${id}`}>
            View
          </a>
          <a className="button secondary" href="/characters">
            Library
          </a>
          <button className="button" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {error ? <p className="help-text">{error}</p> : null}

      <section className="panel">
        <h2>Identity</h2>
        <div className="form-grid two">
          <label className="field">
            Character name
            <input
              className="input"
              value={sheet.header.character_name}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  header: { ...prev.header, character_name: event.target.value },
                }))
              }
            />
          </label>
          <label className="field">
            Player name
            <input
              className="input"
              value={sheet.header.player_name ?? ''}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  header: { ...prev.header, player_name: event.target.value || null },
                }))
              }
            />
          </label>
          <label className="field">
            Weakness
            <input
              className="input"
              value={sheet.header.weakness ?? ''}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  header: { ...prev.header, weakness: event.target.value || null },
                }))
              }
            />
          </label>
          <label className="field">
            Appearance
            <input
              className="input"
              value={sheet.header.appearance ?? ''}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  header: { ...prev.header, appearance: event.target.value || null },
                }))
              }
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Status</h2>
        <div className="form-grid two">
          <label className="field">
            HP
            <input
              className="input"
              type="number"
              min={0}
              max={sheet.hit_points.max}
              value={sheet.hit_points.current}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  hit_points: {
                    ...prev.hit_points,
                    current: Math.max(
                      0,
                      Math.min(prev.hit_points.max, Number(event.target.value) || 0),
                    ),
                  },
                }))
              }
            />
          </label>
          <label className="field">
            WP
            <input
              className="input"
              type="number"
              min={0}
              max={sheet.willpower_points.max}
              value={sheet.willpower_points.current}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  willpower_points: {
                    ...prev.willpower_points,
                    current: Math.max(
                      0,
                      Math.min(prev.willpower_points.max, Number(event.target.value) || 0),
                    ),
                  },
                }))
              }
            />
          </label>
        </div>

        <h3>Conditions</h3>
        <div className="skill-grid">
          {conditionKeys.map((key) => (
            <div key={key} className="skill-card">
              <label>
                <span>{conditionLabels[key] ?? key}</span>
                <input
                  type="checkbox"
                  checked={Boolean(sheet.conditions[key])}
                  onChange={() =>
                    updateSheet((prev) => ({
                      ...prev,
                      conditions: { ...prev.conditions, [key]: !prev.conditions[key] },
                    }))
                  }
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Currency</h2>
        <div className="form-grid three">
          <label className="field">
            Gold
            <input
              className="input"
              type="number"
              min={0}
              value={sheet.currency.gold}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  currency: {
                    ...prev.currency,
                    gold: Math.max(0, Number(event.target.value) || 0),
                  },
                }))
              }
            />
          </label>
          <label className="field">
            Silver
            <input
              className="input"
              type="number"
              min={0}
              value={sheet.currency.silver}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  currency: {
                    ...prev.currency,
                    silver: Math.max(0, Number(event.target.value) || 0),
                  },
                }))
              }
            />
          </label>
          <label className="field">
            Copper
            <input
              className="input"
              type="number"
              min={0}
              value={sheet.currency.copper}
              onChange={(event) =>
                updateSheet((prev) => ({
                  ...prev,
                  currency: {
                    ...prev.currency,
                    copper: Math.max(0, Number(event.target.value) || 0),
                  },
                }))
              }
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Inventory</h2>

        <h3>Packing</h3>
        {sheet.packing.length === 0 ? <p className="page-subtitle">No items packed yet.</p> : null}
        <div className="summary-grid">
          {sheet.packing
            .slice()
            .sort((a, b) => a.slot - b.slot)
            .map((entry) => (
              <div key={`${entry.slot}-${entry.item}`} className="summary-card">
                <strong>
                  Slot {entry.slot}: {entry.item}
                </strong>
                <div className="summary-list">
                  <span>
                    {entry.pack_id && entry.item_id ? `${entry.pack_id}:${entry.item_id}` : ''}
                  </span>
                  <span>{entry.item_sv ?? ''}</span>
                </div>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() =>
                    updateSheet((prev) => ({
                      ...prev,
                      packing: prev.packing.filter((p) => p.slot !== entry.slot),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <h3>Weapons</h3>
        {sheet.weapons.length === 0 ? <p className="page-subtitle">No weapons added yet.</p> : null}
        <div className="summary-grid">
          {sheet.weapons.map((weapon, index) => (
            <div key={`${weapon.name}-${index}`} className="summary-card">
              <strong>{weapon.name}</strong>
              <div className="summary-list">
                <span>{weapon.damage}</span>
                <span>
                  {weapon.pack_id && weapon.item_id ? `${weapon.pack_id}:${weapon.item_id}` : ''}
                </span>
              </div>
              <button
                className="button secondary"
                type="button"
                onClick={() =>
                  updateSheet((prev) => ({
                    ...prev,
                    weapons: prev.weapons.filter((_, current) => current !== index),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <h3>Armor</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <strong>Body armor</strong>
            <div className="summary-list">
              <span>{sheet.armor.body_armor ? sheet.armor.body_armor.name : 'None'}</span>
              <span>
                {sheet.armor.body_armor ? `Protection ${sheet.armor.body_armor.protection}` : ''}
              </span>
            </div>
            {sheet.armor.body_armor ? (
              <button
                className="button secondary"
                type="button"
                onClick={() =>
                  updateSheet((prev) => ({ ...prev, armor: { ...prev.armor, body_armor: null } }))
                }
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="summary-card">
            <strong>Helmet</strong>
            <div className="summary-list">
              <span>{sheet.armor.helmet ? sheet.armor.helmet.name : 'None'}</span>
              <span>{sheet.armor.helmet ? `Protection ${sheet.armor.helmet.protection}` : ''}</span>
            </div>
            {sheet.armor.helmet ? (
              <button
                className="button secondary"
                type="button"
                onClick={() =>
                  updateSheet((prev) => ({ ...prev, armor: { ...prev.armor, helmet: null } }))
                }
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="button secondary"
            type="button"
            onClick={() => setShowItemPicker((prev) => !prev)}
          >
            {showItemPicker ? 'Hide item picker' : 'Add item from packs'}
          </button>
        </div>
      </section>

      {showItemPicker ? <ItemPicker title="Item picker" onSelect={addFromCatalog} /> : null}

      <section className="panel">
        <h2>Danger Zone</h2>
        <p className="help-text">This cannot be undone.</p>
        <button className="button secondary" type="button" onClick={handleDelete} disabled={saving}>
          Delete character
        </button>
      </section>
    </div>
  );
}
