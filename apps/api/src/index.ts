import Fastify from 'fastify';
import cors from '@fastify/cors';

import { AppInfo } from '@dbu/types';
import { serviceLabel } from '@dbu/utils';

import { requireAuth, requireRole } from './auth.js';
import { registerAdventureRoutes } from './adventureRoutes.js';
import { registerCharacterRoutes } from './characterRoutes.js';
import { registerEncounterRoutes } from './encounterRoutes.js';
import { registerPackRoutes } from './packRoutes.js';

const appInfo: AppInfo = {
  name: 'Dragonbane Unbound API',
  tagline: 'Local-first services for Dragonbane Unbound.',
  stage: 'alpha',
};

const server = Fastify({ logger: true });

const splitOrigins = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const allowedOrigins = splitOrigins(process.env.API_CORS_ORIGINS).concat(
  splitOrigins(process.env.SUPABASE_ALLOWED_ORIGINS),
);

await server.register(cors, {
  origin: (origin, cb) => {
    // Allow non-browser clients (no Origin header).
    if (!origin) return cb(null, true);

    // If no allowlist configured, allow all origins in dev.
    if (allowedOrigins.length === 0) return cb(null, true);

    return cb(null, allowedOrigins.includes(origin));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
});

server.get('/health', async () => {
  return {
    status: 'ok',
    service: serviceLabel('api'),
    name: appInfo.name,
    stage: appInfo.stage,
  };
});

server.get('/me', { preHandler: requireAuth }, async (request) => {
  return {
    userId: request.auth?.userId,
    email: request.auth?.email,
    roles: request.auth?.roles ?? [],
  };
});

server.get('/admin/ping', { preHandler: requireRole(['admin']) }, async () => {
  return { status: 'ok', role: 'admin' };
});

server.get('/gm/ping', { preHandler: requireRole(['game-master']) }, async () => {
  return { status: 'ok', role: 'game-master' };
});

registerCharacterRoutes(server);
registerEncounterRoutes(server);
registerPackRoutes(server);
registerAdventureRoutes(server);

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 4000);

server.listen({ port, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
