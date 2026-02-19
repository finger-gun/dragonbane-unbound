import Fastify from 'fastify';

import { AppInfo } from '@dbu/types';
import { serviceLabel } from '@dbu/utils';

import { requireAuth, requireRole } from './auth.js';

const appInfo: AppInfo = {
  name: 'Dragonbane Unbound API',
  tagline: 'Local-first services for Dragonbane Unbound.',
  stage: 'alpha',
};

const server = Fastify({ logger: true });

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

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 4000);

server.listen({ port, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
