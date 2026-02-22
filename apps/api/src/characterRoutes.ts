import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import type { CharacterAttributes, CharacterRecord, CharacterSheet } from '@dbu/types';
import { buildCharacterSheet } from '@dbu/engine';

import { requireAuth, requireRole } from './auth.js';
import { supabaseAdmin } from './supabase.js';

type CharacterCreatePayload = {
  header: {
    player_name?: string | null;
    character_name: string;
    kin_id: string;
    age: 'Young' | 'Middle-Aged' | 'Old';
    profession_id: string;
    weakness?: string | null;
    appearance?: string | null;
  };
  attributes: CharacterAttributes;
  trained_skill_ids: string[];
};

const isAttributes = (value: unknown): value is CharacterAttributes => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['STR', 'CON', 'AGL', 'INT', 'WIL', 'CHA'].every((key) => typeof record[key] === 'number');
};

const parseCreatePayload = (payload: unknown): CharacterCreatePayload | null => {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Partial<CharacterCreatePayload>;
  if (!record.header || !record.attributes || !record.trained_skill_ids) return null;
  if (!isAttributes(record.attributes)) return null;
  if (!Array.isArray(record.trained_skill_ids)) return null;
  return record as CharacterCreatePayload;
};

export const registerCharacterRoutes = (server: FastifyInstance) => {
  server.get('/characters', { preHandler: requireAuth }, async (request, reply) => {
    const query = request.query as { scope?: string };

    if (query.scope === 'all') {
      const auth = await requireRole(['game-master'])(request, reply);
      if (!auth) return;

      const { data, error } = await supabaseAdmin
        .from('characters')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        reply.code(500).send({ error: error.message });
        return;
      }

      reply.send({ characters: data ?? [] });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('user_id', request.auth?.userId ?? '')
      .order('updated_at', { ascending: false });

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    reply.send({ characters: data ?? [] });
  });

  server.post('/characters', { preHandler: requireAuth }, async (request, reply) => {
    const payload = parseCreatePayload(request.body);
    if (!payload) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    try {
      const sheet = buildCharacterSheet({
        playerName: payload.header.player_name ?? null,
        characterName: payload.header.character_name,
        kinId: payload.header.kin_id,
        age: payload.header.age,
        professionId: payload.header.profession_id,
        weakness: payload.header.weakness ?? null,
        appearance: payload.header.appearance ?? null,
        attributes: payload.attributes,
        trainedSkillIds: payload.trained_skill_ids,
      });

      sheet.portrait = {
        kind: 'kin',
        kin_ref: `core:${payload.header.kin_id}`,
      };

      const id = randomUUID();
      const record: CharacterRecord = {
        id,
        user_id: request.auth?.userId ?? '',
        data: sheet,
      };

      const { data, error } = await supabaseAdmin
        .from('characters')
        .insert(record)
        .select()
        .single();

      if (error) {
        reply.code(500).send({ error: error.message });
        return;
      }

      reply.send({ character: data });
    } catch (error) {
      reply.code(400).send({ error: error instanceof Error ? error.message : 'invalid_character' });
    }
  });

  server.get('/characters/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data, error } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .maybeSingle();

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    if (!data) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    reply.send({ character: data });
  });

  server.get('/characters/:id/adventures', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data: character, error: characterError } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .maybeSingle();

    if (characterError) {
      reply.code(500).send({ error: characterError.message });
      return;
    }

    if (!character) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const { data: links, error: linksError } = await supabaseAdmin
      .from('adventure_characters')
      .select('*')
      .eq('character_id', id)
      .eq('owner_user_id', request.auth?.userId ?? '')
      .order('created_at', { ascending: false });

    if (linksError) {
      reply.code(500).send({ error: linksError.message });
      return;
    }

    const adventureIds = Array.from(new Set((links ?? []).map((link) => link.adventure_id)));
    const { data: adventures, error: adventuresError } = adventureIds.length
      ? await supabaseAdmin.from('adventures').select('*').in('id', adventureIds)
      : { data: [], error: null };

    if (adventuresError) {
      reply.code(500).send({ error: adventuresError.message });
      return;
    }

    const byId = new Map((adventures ?? []).map((adventure) => [adventure.id, adventure]));
    const enriched = (links ?? []).map((link) => ({
      link,
      adventure: byId.get(link.adventure_id) ?? null,
    }));

    reply.send({ adventures: enriched });
  });

  server.delete('/characters/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { error, count } = await supabaseAdmin
      .from('characters')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '');

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    if (!count) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    reply.send({ status: 'ok' });
  });

  server.put('/characters/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { data?: CharacterSheet };

    if (!body?.data) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .update({ data: body.data })
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .select()
      .single();

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    reply.send({ character: data });
  });

  server.patch('/characters/:id/runtime', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as Partial<{
      conditions: CharacterSheet['conditions'];
      hit_points: CharacterSheet['hit_points'];
      willpower_points: CharacterSheet['willpower_points'];
      currency: CharacterSheet['currency'];
      weapons: CharacterSheet['weapons'];
      armor: CharacterSheet['armor'];
      packing: CharacterSheet['packing'];
    }>;

    const { data: existing, error: readError } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .maybeSingle();

    if (readError) {
      reply.code(500).send({ error: readError.message });
      return;
    }

    if (!existing) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const sheet = existing.data as CharacterSheet;
    const updated: CharacterSheet = {
      ...sheet,
      conditions: body.conditions ?? sheet.conditions,
      hit_points: body.hit_points ?? sheet.hit_points,
      willpower_points: body.willpower_points ?? sheet.willpower_points,
      currency: body.currency ?? sheet.currency,
      weapons: body.weapons ?? sheet.weapons,
      armor: body.armor ?? sheet.armor,
      packing: body.packing ?? sheet.packing,
    };

    const { data: saved, error: writeError } = await supabaseAdmin
      .from('characters')
      .update({ data: updated })
      .eq('id', id)
      .eq('user_id', request.auth?.userId ?? '')
      .select()
      .single();

    if (writeError) {
      reply.code(500).send({ error: writeError.message });
      return;
    }

    reply.send({ character: saved });
  });
};
