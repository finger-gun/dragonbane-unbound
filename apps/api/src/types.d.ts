import type { AuthContext } from './auth';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}
