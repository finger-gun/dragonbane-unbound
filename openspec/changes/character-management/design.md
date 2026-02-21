## Context

The current web app supports creating a character and viewing a character summary, plus a basic encounter tracker. Data is stored in Supabase tables (`public.characters`, `public.encounters`) as a JSONB blob per record and is accessed through a Node/Fastify API using the Supabase service role.

Observed gaps:

- No character index/list view.
- Character updates exist as a full-sheet `PUT`, but there is no dedicated editing UI and no deletion.
- Encounters are built from manually typed participants; they are not linked to characters.
- Packs are discoverable only as metadata; there is no way to browse/search items and add them to a character.
- There is no shared “adventure/campaign session” concept to group play state.

Constraints:

- Local-first developer experience remains a priority.
- Keep changes incremental and compatible with the existing JSONB storage approach.
- Authorization is enforced at the API layer (not RLS) for now.

## Goals / Non-Goals

**Goals:**

- Add API + UI flows for character list, edit, and delete.
- Allow updating character runtime state (conditions, HP/WP, equipment/inventory) with clear edit boundaries.
- Provide an item catalog sourced from local packs and a selection UI to add those items to a character.
- Allow encounter creation to select from existing characters and keep a stable `character_id` reference on participants.
- Introduce an “adventure sessions” foundation that can:
  - group encounters under an adventure,
  - associate characters to adventures with active/completed state,
  - support a join/invite flow suitable for local dev.

**Non-Goals:**

- Full rules enforcement for inventory limits, item durability, spell prep, etc. (store and display only).
- Real-time collaboration / multiplayer sync.
- Final security posture with Supabase RLS (defer; API-only authz remains).
- Comprehensive content pack ecosystem (start with items/equipment only).

## Decisions

- Keep `characters.data` and `encounters.data` as the canonical document payloads; introduce small denormalized columns only where needed for list/query performance (e.g., `name`, `adventure_id`).
  - Alternative: fully normalized relational schema for characters/encounters. Rejected for now due to scope and iteration speed.

- Introduce a pack content catalog API that reads pack directories on the server and serves a normalized item shape to the web client.
  - Alternative: embed item lists in the web bundle. Rejected because packs are intended to be modular and discoverable at runtime.

- Add a minimal “adventure” model using dedicated tables (`adventures`, `adventure_members`, `adventure_characters`) and attach encounters to an adventure via `adventure_id`.
  - Alternative: store adventure membership inside character JSON only. Rejected because it makes listing/filtering and multi-user sharing harder.

- Authorization model:
  - Default: users can see/manage their own characters and their own adventures.
  - Game masters (`game-master` role) can list all characters to support encounter creation.
  - Adventure membership gates access to adventure-scoped encounters/rosters.
  - Alternative: allow GMs global edit access to all characters. Rejected; start with read/select-only to reduce risk.

## Risks / Trade-offs

- [Service-role Supabase client] → Mitigation: keep all data access behind API auth checks; add explicit GM-only endpoints and narrow what they return.
- [Pack content growth/perf] → Mitigation: cache pack catalog in-memory with filesystem mtime-based invalidation in dev.
- [Adventure join security] → Mitigation: use short-lived join codes in dev; treat as non-production feature until RLS and stronger invite flows exist.
- [JSONB evolution] → Mitigation: version payloads where needed and keep migrations additive.

## Open Questions

- Character editing scope: should editing allow changing creation-defining fields (kin, profession, age, attributes, trained skills) or only runtime state + identity?
- Adventure join mechanism: prefer join codes, email invites, or explicit GM-managed membership for the first iteration?
- GM permissions: should `game-master` be read/select-only globally, or also able to edit/delete characters within an adventure they run?
