import { describe, expect, it, beforeAll } from 'vitest';

import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const apiBase = process.env.API_BASE_URL ?? `http://localhost:${process.env.API_PORT ?? 4000}`;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const canReachApi = async () => {
  try {
    const response = await fetch(`${apiBase}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

const signInAndGetToken = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env.');
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'player@local.test',
    password: 'localpass123!',
  });
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error('Missing access token');
  return token;
};

let available = false;

beforeAll(async () => {
  available = await canReachApi();
});

describe('API integration (local dev)', () => {
  it('lists and searches pack items', async () => {
    if (!available) return;
    const token = await signInAndGetToken();

    const list = await fetch(`${apiBase}/packs/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.ok).toBe(true);
    const payload = (await list.json()) as { items?: Array<{ id: string }> };
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items?.some((item) => item.id === 'core:torch')).toBe(true);

    const search = await fetch(`${apiBase}/packs/items?q=torch`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(search.ok).toBe(true);
    const searchPayload = (await search.json()) as { items?: Array<{ id: string }> };
    expect(searchPayload.items?.some((item) => item.id === 'core:torch')).toBe(true);
  });

  it('creates, lists, and deletes a character', async () => {
    if (!available) return;
    const token = await signInAndGetToken();

    const create = await fetch(`${apiBase}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        header: {
          player_name: 'API Test',
          character_name: `API Test ${Date.now()}`,
          kin_id: 'human',
          age: 'Middle-Aged',
          profession_id: 'bard',
          weakness: null,
          appearance: null,
        },
        attributes: { STR: 10, CON: 10, AGL: 10, INT: 10, WIL: 10, CHA: 10 },
        trained_skill_ids: [
          'bluffa',
          'frammande_sprak',
          'hoppa_klattra',
          'kniv',
          'myter_legender',
          'undvika',
          'bestiologi',
          'fingerfardighet',
          'finna_dolda_ting',
          'hantverk',
        ],
      }),
    });
    expect(create.ok).toBe(true);
    const createdPayload = (await create.json()) as { character?: { id: string } };
    const id = createdPayload.character?.id;
    expect(typeof id).toBe('string');
    if (!id) return;

    const list = await fetch(`${apiBase}/characters`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.ok).toBe(true);
    const listPayload = (await list.json()) as { characters?: Array<{ id: string }> };
    expect(listPayload.characters?.some((row) => row.id === id)).toBe(true);

    const del = await fetch(`${apiBase}/characters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(del.ok).toBe(true);

    const listAfter = await fetch(`${apiBase}/characters`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(listAfter.ok).toBe(true);
    const afterPayload = (await listAfter.json()) as { characters?: Array<{ id: string }> };
    expect(afterPayload.characters?.some((row) => row.id === id)).toBe(false);
  });
});
