'use client';

import { useEffect, useMemo, useState } from 'react';

import type { PackItemCatalogEntry, PackItemKind } from '@dbu/types';

import { getSupabaseClient } from '../../lib/supabaseClient';

type ItemPickerProps = {
  title?: string;
  kinds?: PackItemKind[];
  onSelect: (item: PackItemCatalogEntry) => void;
};

export default function ItemPicker({ title = 'Add item', kinds, onSelect }: ItemPickerProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PackItemCatalogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!kinds || kinds.length === 0) return items;
    const kindSet = new Set(kinds);
    return items.filter((item) => kindSet.has(item.kind));
  }, [items, kinds]);

  const fetchItems = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        throw new Error('You must be signed in to browse items.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const search = q.trim();
      const url = new URL(`${apiUrl}/packs/items`);
      if (search) url.searchParams.set('q', search);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to load item catalog.');
      }

      const payload = (await response.json()) as { items?: PackItemCatalogEntry[] };
      setItems(payload.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="panel">
      <h2>{title}</h2>
      <div className="form-grid two">
        <label className="field">
          Search
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="field" style={{ alignSelf: 'end' }}>
          <button
            className="button secondary"
            type="button"
            onClick={() => fetchItems(query)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error ? <p className="help-text">{error}</p> : null}

      <div className="summary-grid">
        {filtered.map((item) => (
          <div key={item.id} className="summary-card">
            <strong>{item.name}</strong>
            <div className="summary-list">
              <span>
                {item.kind} · {item.pack_id}
              </span>
              <span>{item.description ?? ''}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="button secondary" type="button" onClick={() => onSelect(item)}>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 ? <p className="page-subtitle">No items found.</p> : null}
    </div>
  );
}
