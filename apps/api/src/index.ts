import Fastify from 'fastify';

import { AppInfo } from '@dbu/types';
import { serviceLabel } from '@dbu/utils';

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

const port = Number(process.env.PORT ?? 4000);

server.listen({ port, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
