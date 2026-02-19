import type { FastifyReply, FastifyRequest } from 'fastify';

import { supabaseAdmin } from './supabase.js';

export type AuthContext = {
  userId: string;
  email: string | null;
  roles: string[];
};

const parseBearerToken = (request: FastifyRequest) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
};

export const getAuthContext = async (request: FastifyRequest): Promise<AuthContext | null> => {
  const token = parseBearerToken(request);
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const roles = await getUserRoles(data.user.id);

  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    roles,
  };
};

export const getUserRoles = async (userId: string): Promise<string[]> => {
  const { data } = await supabaseAdmin
    .from('user_roles')
    .select('roles')
    .eq('user_id', userId)
    .maybeSingle();

  return data?.roles ?? [];
};

export const setUserRoles = async (userId: string, roles: string[]) => {
  return supabaseAdmin.from('user_roles').upsert({ user_id: userId, roles });
};

export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const auth = await getAuthContext(request);
  if (!auth) {
    reply.code(401).send({ error: 'unauthorized' });
    return null;
  }
  request.auth = auth;
  return auth;
};

export const requireRole = (roles: string[]) => async (request: FastifyRequest, reply: FastifyReply) => {
  const auth = request.auth ?? (await requireAuth(request, reply));
  if (!auth) return null;
  const hasRole = roles.some((role) => auth.roles.includes(role));
  if (!hasRole) {
    reply.code(403).send({ error: 'forbidden' });
    return null;
  }
  return auth;
};
