## Context

We are moving from foundation work into the first playable MVP loop: character creation, encounter tracking, and content/rules loading. The platform is local-first with Supabase as the data store, Next.js for the web UI, and a Node API for server-side enforcement and shared logic. We already have baseline auth and local dev workflows in place.

## Goals / Non-Goals

**Goals:**
- Deliver a minimal, coherent character sheet flow backed by the canonical data in `docs/character_creation/`.
- Provide an encounter tracker with initiative order, turn progression, and a combat log.
- Establish a content pack loader that can discover and validate pack metadata locally.
- Establish a minimal rules DSL and evaluation path for derived stats and roll receipts.

**Non-Goals:**
- Full rules coverage or complete combat automation.
- Comprehensive content tooling, pack publishing, or marketplace features.
- Multiplayer synchronization or real-time collaboration.

## Decisions

- **Store character and encounter state in Supabase (JSONB for rules data).**
  - Rationale: local-first persistence with flexibility for evolving schemas.
  - Alternatives: purely client-side storage (harder to share, not durable), rigid relational modeling (too early for MVP).

- **Load content packs from local filesystem first, with schema validation.**
  - Rationale: supports local-first development and predictable pack discovery.
  - Alternatives: hosted-only packs or dynamic remote fetching (not aligned with local-first).

- **Rules DSL baseline focuses on derived stats and receipts only.**
  - Rationale: MVP needs deterministic derived values and auditability; combat rules can expand later.
  - Alternatives: full combat DSL now (too large for MVP).

- **UI flows emphasize minimal editing and review rather than full automation.**
  - Rationale: match MVP scope while ensuring core data can be created and validated.

## Risks / Trade-offs

- **Schema drift between JSON data and UI** → Mitigation: reference `docs/character_creation/` schema files and validate using JSON schema where possible.
- **Rules DSL too narrow** → Mitigation: design receipts to be extensible and keep DSL minimal but structured.
- **Content pack validation complexity** → Mitigation: start with metadata validation only, defer full content validation.
