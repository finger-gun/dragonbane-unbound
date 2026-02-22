import Fastify from 'fastify';
import { describe, expect, it, vi } from 'vitest';

import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { registerCharacterRoutes } from '../src/characterRoutes.js';
import { registerPackRoutes } from '../src/packRoutes.js';

const writeJson = async (filePath: string, value: unknown) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
};

const makeTempPacksDir = async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dbu-packs-'));
  const coreDir = path.join(root, 'core');

  await writeJson(path.join(coreDir, 'pack.json'), {
    id: 'core',
    name: 'Core Pack',
    version: '0.1.0',
  });

  await writeJson(path.join(coreDir, 'items.json'), {
    items: [
      { id: 'torch', kind: 'item', name: 'Torch' },
      { id: 'rope', kind: 'item', name: 'Rope' },
    ],
  });

  const pngPath = path.join(coreDir, 'assets', 'portraits', 'kins', 'human.png');
  await fs.mkdir(path.dirname(pngPath), { recursive: true });
  await fs.writeFile(pngPath, Buffer.from('not-a-real-png-but-ok'));

  await writeJson(path.join(coreDir, 'assets', 'portraits', 'index.json'), {
    kins: {
      'core:human': 'assets/portraits/kins/human.png',
    },
  });

  return root;
};

function makeSupabase(overrides: Partial<Record<string, any>> = {}) {
  const state = {
    characters: [
      {
        id: 'c1',
        user_id: 'u1',
        updated_at: '2026-02-21T00:00:00.000Z',
        data: { header: { character_name: 'A', kin: 'Human', profession: 'Bard', age: 'Young' } },
      },
      {
        id: 'c2',
        user_id: 'u2',
        updated_at: '2026-02-21T00:00:01.000Z',
        data: { header: { character_name: 'B', kin: 'Elf', profession: 'Mage', age: 'Old' } },
      },
    ],
  };

  const chain = (table: string) => {
    const ctx: any = {
      table,
      filters: [] as Array<[string, string, any]>,
      _count: null as number | null,
    };
    const api: any = {
      select: () => api,
      order: () => Promise.resolve({ data: state[table as keyof typeof state] ?? [], error: null }),
      in: () => Promise.resolve({ data: state[table as keyof typeof state] ?? [], error: null }),
      eq: (field: string, value: any) => {
        ctx.filters.push(['eq', field, value]);
        return api;
      },
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
      delete: (opts?: any) => {
        ctx._count = opts?.count === 'exact' ? 1 : null;
        return {
          eq: () => ({
            eq: () => Promise.resolve({ error: null, count: ctx._count }),
          }),
        };
      },
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    };

    if (table === 'characters') {
      api.order = () => {
        let list = [...state.characters];
        ctx.filters.forEach(([op, field, value]) => {
          if (op === 'eq') {
            list = list.filter((row: any) => row[field] === value);
          }
        });
        return Promise.resolve({ data: list, error: null });
      };
    }

    return api;
  };

  return {
    from: (table: string) => (overrides[table] ? overrides[table] : chain(table)),
  };
}

vi.mock('../src/auth.js', () => {
  return {
    requireAuth: async (request: any) => {
      request.auth = { userId: 'u1', email: 'u1@test', roles: ['game-master'] };
      return request.auth;
    },
    requireRole: (_roles: string[]) => async (request: any) => {
      request.auth = request.auth ?? { userId: 'u1', email: 'u1@test', roles: ['game-master'] };
      return request.auth;
    },
  };
});

vi.mock('../src/supabase.js', () => {
  return { supabaseAdmin: makeSupabase() };
});

describe('api routes', () => {
  it('GET /characters returns user characters', async () => {
    const app = Fastify();
    registerCharacterRoutes(app);

    const res = await app.inject({ method: 'GET', url: '/characters' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.characters).toHaveLength(1);
    expect(body.characters[0].id).toBe('c1');
  });

  it('GET /characters?scope=all returns all characters for game-master', async () => {
    const app = Fastify();
    registerCharacterRoutes(app);

    const res = await app.inject({ method: 'GET', url: '/characters?scope=all' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.characters).toHaveLength(2);
  });

  it('DELETE /characters/:id returns ok when deleted', async () => {
    const app = Fastify();
    registerCharacterRoutes(app);

    const res = await app.inject({ method: 'DELETE', url: '/characters/c1' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('GET /packs/items returns items and supports q filtering', async () => {
    const packsDir = await makeTempPacksDir();
    process.env.PACKS_DIR = packsDir;
    const app = Fastify();
    registerPackRoutes(app);

    const res = await app.inject({ method: 'GET', url: '/packs/items?q=torch' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('core:torch');
  });

  it('GET /packs/portraits/kins/resolve returns an asset url', async () => {
    const packsDir = await makeTempPacksDir();
    process.env.PACKS_DIR = packsDir;

    const app = Fastify();
    registerPackRoutes(app);

    const res = await app.inject({
      method: 'GET',
      url: '/packs/portraits/kins/resolve?ref=core:human',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.pack_id).toBe('core');
    expect(body.path).toBe('assets/portraits/kins/human.png');
    expect(body.url).toContain('/packs/assets');
  });

  it('GET /packs/portraits/kins serves image bytes', async () => {
    const packsDir = await makeTempPacksDir();
    process.env.PACKS_DIR = packsDir;

    const app = Fastify();
    registerPackRoutes(app);

    const res = await app.inject({
      method: 'GET',
      url: '/packs/portraits/kins?ref=core:human',
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /packs/assets rejects path traversal', async () => {
    const packsDir = await makeTempPacksDir();
    process.env.PACKS_DIR = packsDir;

    const app = Fastify();
    registerPackRoutes(app);

    const res = await app.inject({
      method: 'GET',
      url: '/packs/assets?pack_id=core&path=../../etc/passwd',
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('invalid_asset_path');
  });
});
