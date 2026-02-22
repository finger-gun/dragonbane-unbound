import type { FastifyInstance } from 'fastify';
import { promises as fs } from 'fs';
import path from 'path';

import { loadLocalPackItems, loadLocalPacks, resolveKinPortraitAsset } from '@dbu/adapters';
import type { ContentRef } from '@dbu/types';

import { requireAuth } from './auth.js';

const isSafeRelativePath = (value: string) => {
  if (!value) return false;
  if (path.isAbsolute(value)) return false;
  const normalized = path.normalize(value);
  if (normalized.startsWith('..') || normalized.includes(`..${path.sep}`)) return false;
  return true;
};

const contentTypeForPath = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
};

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

  server.get(
    '/packs/portraits/kins/resolve',
    { preHandler: requireAuth },
    async (request, reply) => {
      const query = request.query as { ref?: string };
      const ref = query.ref?.trim();
      if (!ref) {
        reply.code(400).send({ error: 'missing_ref' });
        return;
      }

      const rootDir =
        process.env.PACKS_DIR ?? path.resolve(process.cwd(), '..', '..', 'content-packs');

      const resolved = await resolveKinPortraitAsset(rootDir, ref as ContentRef);
      if (!resolved.pack || !resolved.assetPath) {
        reply.code(404).send({ error: 'not_found' });
        return;
      }

      const assetPath = resolved.assetPath.replace(/\\/g, '/');
      reply.send({
        url: `/packs/assets?pack_id=${encodeURIComponent(resolved.pack.metadata.id)}&path=${encodeURIComponent(
          assetPath,
        )}`,
        pack_id: resolved.pack.metadata.id,
        path: assetPath,
      });
    },
  );

  server.get('/packs/portraits/kins', { preHandler: requireAuth }, async (request, reply) => {
    const query = request.query as { ref?: string };
    const ref = query.ref?.trim();
    if (!ref) {
      reply.code(400).send({ error: 'missing_ref' });
      return;
    }

    const rootDir =
      process.env.PACKS_DIR ?? path.resolve(process.cwd(), '..', '..', 'content-packs');

    const resolved = await resolveKinPortraitAsset(rootDir, ref as ContentRef);
    if (!resolved.pack || !resolved.assetPath) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    if (
      !isSafeRelativePath(resolved.assetPath) ||
      (!resolved.assetPath.startsWith(`assets${path.sep}`) &&
        !resolved.assetPath.startsWith('assets/'))
    ) {
      reply.code(400).send({ error: 'invalid_asset_path' });
      return;
    }

    const filePath = path.join(resolved.pack.directory, resolved.assetPath);
    try {
      const data = await fs.readFile(filePath);
      reply
        .header('Content-Type', contentTypeForPath(filePath))
        .header('Cache-Control', 'private, max-age=3600')
        .send(data);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as NodeJS.ErrnoException).code === 'ENOENT'
      ) {
        reply.code(404).send({ error: 'not_found' });
        return;
      }
      reply.code(500).send({ error: 'asset_read_failed' });
    }
  });

  server.get('/packs/assets', { preHandler: requireAuth }, async (request, reply) => {
    const query = request.query as { pack_id?: string; path?: string };
    const packId = query.pack_id?.trim();
    const assetPath = query.path?.trim();

    if (!packId || !assetPath) {
      reply.code(400).send({ error: 'missing_pack_or_path' });
      return;
    }

    if (
      !isSafeRelativePath(assetPath) ||
      (!assetPath.startsWith(`assets${path.sep}`) && !assetPath.startsWith('assets/'))
    ) {
      reply.code(400).send({ error: 'invalid_asset_path' });
      return;
    }

    const rootDir =
      process.env.PACKS_DIR ?? path.resolve(process.cwd(), '..', '..', 'content-packs');
    const { packs } = await loadLocalPacks(rootDir);
    const pack = packs.find((entry) => entry.metadata.id === packId);
    if (!pack) {
      reply.code(404).send({ error: 'pack_not_found' });
      return;
    }

    const filePath = path.join(pack.directory, assetPath);
    try {
      const data = await fs.readFile(filePath);
      reply
        .header('Content-Type', contentTypeForPath(filePath))
        .header('Cache-Control', 'private, max-age=3600')
        .send(data);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as NodeJS.ErrnoException).code === 'ENOENT'
      ) {
        reply.code(404).send({ error: 'not_found' });
        return;
      }
      reply.code(500).send({ error: 'asset_read_failed' });
    }
  });
};
