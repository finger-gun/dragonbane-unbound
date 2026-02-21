## Context

The codebase now has a minimal "adventure" concept and supports associating characters to adventures. The encounter system currently stores encounters in `public.encounters` with a JSONB payload and an owning `user_id`.

The API already has an `adventure_id` field in the encounter create payload and persists `encounters.adventure_id`, but the web UI does not provide a way to create an encounter in an adventure context. As a result, adventures cannot show a timeline/history of encounters.

Local dev uses Supabase/PostgREST schema caching; new tables/columns require migrations to be applied and the rest container to refresh schema.

## Goals / Non-Goals

**Goals:**

- Allow a user to create an encounter that belongs to an adventure.
- List encounters for an adventure in the adventure detail UI.
- Ensure access control is consistent: only adventure members can create/list/view adventure-scoped encounters.

**Non-Goals:**

- Replace encounter tracker UX (initiative, actions, dice roller) in this change.
- Full campaign state, invitations, or real-time collaboration.

## Decisions

- Use `encounters.adventure_id` column for query and membership enforcement, while keeping `encounters.data.adventure_id` as optional context only.
- Add an explicit API endpoint to list encounters by adventure (e.g. `GET /adventures/:id/encounters`) to avoid overloading the generic encounters list.
- Web entrypoints:
  - From adventure detail: "New encounter" link routes to `/encounters/new?adventure_id=<id>` and preselects it.
  - Encounter creation page includes an optional adventure selector for members.

## Risks / Trade-offs

- [Schema cache mismatch in local dev] → Mitigation: ensure migrations are applied and restart `rest` in `pnpm supabase:migrate` docs/checks.
- [Authorization drift] → Mitigation: centralize `isAdventureMember` check and reuse it for list/get/update for scoped encounters.

## Migration Plan

1. Ensure `encounters.adventure_id` exists (SQL migration) and PostgREST is restarted in local dev.
2. Add API list endpoint and update encounter create to accept/validate adventure membership.
3. Update web UI to provide adventure context on encounter creation and show encounters on adventure detail.

## Open Questions

- Should encounters be visible to all adventure members regardless of who created them (recommended), or only to the creator?
- Should adventures have a canonical "current encounter" pointer?
