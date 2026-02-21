import type { FastifyInstance } from 'fastify';
import { randomUUID, randomBytes } from 'crypto';

import { requireAuth, requireRole } from './auth.js';
import { supabaseAdmin } from './supabase.js';

const generateJoinCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(10);
  let code = '';
  for (let i = 0; i < 8; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return code;
};

export const registerAdventureRoutes = (server: FastifyInstance) => {
  server.post(
    '/adventures',
    { preHandler: requireRole(['game-master']) },
    async (request, reply) => {
      const body = request.body as { name?: string };
      const name = body?.name?.trim();

      if (!name) {
        reply.code(400).send({ error: 'invalid_payload' });
        return;
      }

      const id = randomUUID();
      const join_code = generateJoinCode();

      const { error: insertError } = await supabaseAdmin.from('adventures').insert({
        id,
        created_by: request.auth?.userId ?? '',
        name,
        join_code,
      });

      if (insertError) {
        reply.code(500).send({ error: insertError.message });
        return;
      }

      const { error: memberError } = await supabaseAdmin.from('adventure_members').insert({
        adventure_id: id,
        user_id: request.auth?.userId ?? '',
        role: 'game-master',
      });

      if (memberError) {
        reply.code(500).send({ error: memberError.message });
        return;
      }

      reply.send({ adventure: { id, name, join_code } });
    },
  );

  server.post('/adventures/join', { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as { join_code?: string };
    const join_code = body?.join_code?.trim().toUpperCase();

    if (!join_code) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const { data: adventure, error: readError } = await supabaseAdmin
      .from('adventures')
      .select('*')
      .eq('join_code', join_code)
      .maybeSingle();

    if (readError) {
      reply.code(500).send({ error: readError.message });
      return;
    }

    if (!adventure) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const role = request.auth?.roles?.includes('game-master') ? 'game-master' : 'player';
    const { error: upsertError } = await supabaseAdmin
      .from('adventure_members')
      .upsert({ adventure_id: adventure.id, user_id: request.auth?.userId ?? '', role });

    if (upsertError) {
      reply.code(500).send({ error: upsertError.message });
      return;
    }

    reply.send({ adventure });
  });

  server.get('/adventures', { preHandler: requireAuth }, async (request, reply) => {
    const { data, error } = await supabaseAdmin
      .from('adventure_members')
      .select('role, adventure:adventures(*)')
      .eq('user_id', request.auth?.userId ?? '')
      .order('created_at', { ascending: false });

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    const adventures = (data ?? [])
      .map((row) => ({
        role: (row as any).role as string,
        adventure: (row as any).adventure as any,
      }))
      .filter((row) => Boolean(row.adventure));

    reply.send({ adventures });
  });

  server.get('/adventures/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const userId = request.auth?.userId ?? '';
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('adventure_members')
      .select('*')
      .eq('adventure_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) {
      reply.code(500).send({ error: membershipError.message });
      return;
    }

    if (!membership) {
      reply.code(403).send({ error: 'forbidden' });
      return;
    }

    const { data: adventure, error: adventureError } = await supabaseAdmin
      .from('adventures')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (adventureError) {
      reply.code(500).send({ error: adventureError.message });
      return;
    }

    if (!adventure) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const { data: members, error: membersError } = await supabaseAdmin
      .from('adventure_members')
      .select('*')
      .eq('adventure_id', id)
      .order('created_at', { ascending: true });

    if (membersError) {
      reply.code(500).send({ error: membersError.message });
      return;
    }

    const { data: links, error: linksError } = await supabaseAdmin
      .from('adventure_characters')
      .select('*')
      .eq('adventure_id', id)
      .order('created_at', { ascending: true });

    if (linksError) {
      reply.code(500).send({ error: linksError.message });
      return;
    }

    const characterIds = Array.from(
      new Set((links ?? []).map((link) => String((link as any).character_id))),
    );

    let charactersById = new Map<string, any>();
    if (characterIds.length > 0) {
      const { data: characterRows, error: characterError } = await supabaseAdmin
        .from('characters')
        .select('*')
        .in('id', characterIds);

      if (characterError) {
        reply.code(500).send({ error: characterError.message });
        return;
      }

      charactersById = new Map((characterRows ?? []).map((row) => [row.id, row]));
    }

    const roster = (links ?? []).map((link) => {
      const characterId = String((link as any).character_id);
      const character = charactersById.get(characterId);
      return {
        link,
        character: character
          ? {
              id: character.id,
              header: character.data?.header,
              user_id: character.user_id,
            }
          : null,
      };
    });

    reply.send({ adventure, membership, members: members ?? [], roster });
  });

  server.post('/adventures/:id/characters', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { character_id?: string; status?: 'active' | 'completed' };
    const character_id = body?.character_id;
    const status = body?.status ?? 'active';

    if (!character_id || (status !== 'active' && status !== 'completed')) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const { data: membership } = await supabaseAdmin
      .from('adventure_members')
      .select('*')
      .eq('adventure_id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .maybeSingle();

    if (!membership) {
      reply.code(403).send({ error: 'forbidden' });
      return;
    }

    const { data: character } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('id', character_id)
      .eq('user_id', request.auth?.userId ?? '')
      .maybeSingle();

    if (!character) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const completed_at = status === 'completed' ? new Date().toISOString() : null;
    const { data: linked, error } = await supabaseAdmin
      .from('adventure_characters')
      .upsert({
        adventure_id: id,
        character_id,
        owner_user_id: request.auth?.userId ?? '',
        status,
        completed_at,
      })
      .select()
      .single();

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    reply.send({ link: linked });
  });

  server.patch(
    '/adventures/:id/characters/:characterId',
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id, characterId } = request.params as { id: string; characterId: string };
      const body = request.body as { status?: 'active' | 'completed' };
      const status = body?.status;

      if (status !== 'active' && status !== 'completed') {
        reply.code(400).send({ error: 'invalid_payload' });
        return;
      }

      const { data: membership } = await supabaseAdmin
        .from('adventure_members')
        .select('*')
        .eq('adventure_id', id)
        .eq('user_id', request.auth?.userId ?? '')
        .maybeSingle();

      if (!membership) {
        reply.code(403).send({ error: 'forbidden' });
        return;
      }

      const completed_at = status === 'completed' ? new Date().toISOString() : null;
      const { data: updated, error } = await supabaseAdmin
        .from('adventure_characters')
        .update({ status, completed_at })
        .eq('adventure_id', id)
        .eq('character_id', characterId)
        .eq('owner_user_id', request.auth?.userId ?? '')
        .select()
        .maybeSingle();

      if (error) {
        reply.code(500).send({ error: error.message });
        return;
      }

      if (!updated) {
        reply.code(404).send({ error: 'not_found' });
        return;
      }

      reply.send({ link: updated });
    },
  );

  server.delete(
    '/adventures/:id/characters/:characterId',
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id, characterId } = request.params as { id: string; characterId: string };

      const { data: membership } = await supabaseAdmin
        .from('adventure_members')
        .select('*')
        .eq('adventure_id', id)
        .eq('user_id', request.auth?.userId ?? '')
        .maybeSingle();

      if (!membership) {
        reply.code(403).send({ error: 'forbidden' });
        return;
      }

      const { error, count } = await supabaseAdmin
        .from('adventure_characters')
        .delete({ count: 'exact' })
        .eq('adventure_id', id)
        .eq('character_id', characterId)
        .eq('owner_user_id', request.auth?.userId ?? '');

      if (error) {
        reply.code(500).send({ error: error.message });
        return;
      }

      if (!count) {
        reply.code(404).send({ error: 'not_found' });
        return;
      }

      reply.send({ status: 'ok' });
    },
  );
};
