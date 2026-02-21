import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import type { Encounter, EncounterLogEntry, EncounterParticipant } from '@dbu/types';

import { requireAuth } from './auth.js';
import { supabaseAdmin } from './supabase.js';

type EncounterCreatePayload = {
  name: string;
  adventure_id?: string | null;
  participants: Array<{
    name: string;
    initiative: number;
    is_player?: boolean;
    character_id?: string | null;
    note?: string | null;
  }>;
};

const sortParticipants = (participants: EncounterParticipant[]) =>
  [...participants].sort((a, b) => b.initiative - a.initiative);

const isAdventureMember = async (adventureId: string, userId: string) => {
  const { data } = await supabaseAdmin
    .from('adventure_members')
    .select('adventure_id')
    .eq('adventure_id', adventureId)
    .eq('user_id', userId)
    .maybeSingle();
  return Boolean(data);
};

const loadEncounterForRequest = async (encounterId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('encounters')
    .select('*')
    .eq('id', encounterId)
    .maybeSingle();
  if (error) return { data: null, error };
  if (!data) return { data: null, error: null };

  const adventureId = (data as any).adventure_id as string | null | undefined;
  if (!adventureId) {
    if ((data as any).user_id !== userId) return { data: null, error: null };
    return { data, error: null };
  }

  const allowed = await isAdventureMember(adventureId, userId);
  if (!allowed) return { data: null, error: null };

  return { data, error: null };
};

export const registerEncounterRoutes = (server: FastifyInstance) => {
  server.post('/encounters', { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as EncounterCreatePayload;
    if (!body?.name || !Array.isArray(body.participants)) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const adventure_id = body.adventure_id ?? null;
    if (adventure_id) {
      const ok = await isAdventureMember(adventure_id, request.auth?.userId ?? '');
      if (!ok) {
        reply.code(403).send({ error: 'forbidden' });
        return;
      }
    }

    const requestedCharacterIds = Array.from(
      new Set(
        body.participants
          .map((participant) => participant.character_id)
          .filter((id): id is string => typeof id === 'string' && id.length > 0),
      ),
    );

    const canUseAllCharacters = request.auth?.roles?.includes('game-master') ?? false;
    const characterLookup = new Map<string, any>();
    if (requestedCharacterIds.length > 0) {
      let query = supabaseAdmin.from('characters').select('*').in('id', requestedCharacterIds);
      if (!canUseAllCharacters) {
        query = query.eq('user_id', request.auth?.userId ?? '');
      }
      const { data, error } = await query;
      if (error) {
        reply.code(500).send({ error: error.message });
        return;
      }
      (data ?? []).forEach((record) => characterLookup.set(record.id, record));
      const missing = requestedCharacterIds.filter((id) => !characterLookup.has(id));
      if (missing.length > 0) {
        reply.code(400).send({ error: 'invalid_character_reference' });
        return;
      }
    }

    const participants: EncounterParticipant[] = body.participants.map((participant) => ({
      id: randomUUID(),
      character_id: participant.character_id ?? null,
      name:
        participant.character_id && characterLookup.get(participant.character_id)
          ? ((characterLookup.get(participant.character_id).data?.header
              ?.character_name as string) ?? participant.name)
          : participant.name,
      initiative: Number(participant.initiative ?? 0),
      is_player: participant.is_player ?? false,
      note: participant.note ?? null,
    }));

    const encounter: Encounter = {
      id: randomUUID(),
      user_id: request.auth?.userId ?? '',
      adventure_id,
      name: body.name,
      participants: sortParticipants(participants),
      turn_index: 0,
      round: 1,
      log: [],
    };

    const { data, error } = await supabaseAdmin
      .from('encounters')
      .insert({
        id: encounter.id,
        user_id: encounter.user_id,
        adventure_id,
        data: encounter,
      })
      .select()
      .single();

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    reply.send({ encounter: data });
  });

  server.get('/encounters/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data, error } = await loadEncounterForRequest(id, request.auth?.userId ?? '');

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    if (!data) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    reply.send({ encounter: data });
  });

  server.put('/encounters/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { data?: Encounter };

    if (!body?.data) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const loaded = await loadEncounterForRequest(id, request.auth?.userId ?? '');
    if (loaded.error) {
      reply.code(500).send({ error: loaded.error.message });
      return;
    }
    if (!loaded.data) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const row = loaded.data as any;
    const filter = supabaseAdmin
      .from('encounters')
      .update({ data: body.data, adventure_id: row.adventure_id ?? null });
    const updateQuery = row.adventure_id
      ? filter.eq('id', id).eq('adventure_id', row.adventure_id)
      : filter.eq('id', id).eq('user_id', request.auth?.userId ?? '');

    const { data, error } = await updateQuery.select().single();

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    reply.send({ encounter: data });
  });

  server.post('/encounters/:id/advance', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data, error } = await loadEncounterForRequest(id, request.auth?.userId ?? '');

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    if (!data) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const encounter = data.data as Encounter;
    const nextIndex = encounter.turn_index + 1;
    const wrapped = nextIndex >= encounter.participants.length;

    const updated: Encounter = {
      ...encounter,
      participants: sortParticipants(encounter.participants),
      turn_index: wrapped ? 0 : nextIndex,
      round: wrapped ? encounter.round + 1 : encounter.round,
    };

    const row = data as any;
    const filter = supabaseAdmin
      .from('encounters')
      .update({ data: updated, adventure_id: row.adventure_id ?? null });
    const updateQuery = row.adventure_id
      ? filter.eq('id', id).eq('adventure_id', row.adventure_id)
      : filter.eq('id', id).eq('user_id', request.auth?.userId ?? '');

    const update = await updateQuery.select().single();

    if (update.error) {
      reply.code(500).send({ error: update.error.message });
      return;
    }

    reply.send({ encounter: update.data });
  });

  server.post('/encounters/:id/logs', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { message?: string; actor_id?: string | null };
    if (!body?.message) {
      reply.code(400).send({ error: 'invalid_payload' });
      return;
    }

    const { data, error } = await loadEncounterForRequest(id, request.auth?.userId ?? '');

    if (error) {
      reply.code(500).send({ error: error.message });
      return;
    }

    if (!data) {
      reply.code(404).send({ error: 'not_found' });
      return;
    }

    const encounter = data.data as Encounter;
    const entry: EncounterLogEntry = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      message: body.message,
      actor_id: body.actor_id ?? null,
    };

    const updated: Encounter = {
      ...encounter,
      log: [...encounter.log, entry],
    };

    const row = data as any;
    const filter = supabaseAdmin
      .from('encounters')
      .update({ data: updated, adventure_id: row.adventure_id ?? null });
    const updateQuery = row.adventure_id
      ? filter.eq('id', id).eq('adventure_id', row.adventure_id)
      : filter.eq('id', id).eq('user_id', request.auth?.userId ?? '');

    const update = await updateQuery.select().single();

    if (update.error) {
      reply.code(500).send({ error: update.error.message });
      return;
    }

    reply.send({ encounter: update.data });
  });
};
