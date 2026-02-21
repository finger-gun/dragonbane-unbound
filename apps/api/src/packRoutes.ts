import type { FastifyInstance } from 'fastify';
import path from 'path';

import { loadLocalPackItems, loadLocalPacks } from '@dbu/adapters';

import { requireAuth } from './auth.js';

export const registerPackRoutes = (server: FastifyInstance) => {
  server.get('/packs', { preHandler: requireAuth }, async (_request, reply) => {
    const rootDir =
      process.env.PACKS_DIR ?? path.resolve(process.cwd(), '..', '..', 'content-packs');
    const { packs, errors } = await loadLocalPacks(rootDir);

    reply.send({
      packs: packs.map((pack) => ({
        directory: pack.directory,
        metadata: pack.metadata,
      })),
      errors,
      rootDir,
    });
  });

  server.get('/packs/items', { preHandler: requireAuth }, async (request, reply) => {
    const query = request.query as { q?: string };
    const rootDir =
      process.env.PACKS_DIR ?? path.resolve(process.cwd(), '..', '..', 'content-packs');
    const { items, errors } = await loadLocalPackItems(rootDir);

    const q = query.q?.trim().toLowerCase();
    const filtered = q
      ? items.filter((item) =>
          [item.name, item.name_sv ?? ''].some((value) => value.toLowerCase().includes(q)),
        )
      : items;

    reply.send({ items: filtered, errors });
  });
};
