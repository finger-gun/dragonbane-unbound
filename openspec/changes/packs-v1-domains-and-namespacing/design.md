## Context

Pack support exists today, but it is limited to a minimal item catalog loaded from a local directory and exposed via the API. Separately, Dragonbane structured reference data currently lives under `source_data/reference-data/` and `docs/character_creation/`, and the engine imports Dragonbane kins/professions/skills/rules directly at build time.

To support modular expansion-style packs (core rulebook, monster book, homebrew) and original pack-provided art, the platform needs:

- typed domain schemas for pack content (not just items)
- canonical namespaced ids to avoid collisions across enabled packs
- loader + API aggregation across multiple domains

This change establishes v1 of those foundations and moves structured data into pack-shaped packages in the monorepo so they can later be published as npm packages if desired.

## Goals / Non-Goals

**Goals:**

- Define a v1 on-disk pack layout and JSON schemas per content domain.
- Define a canonical namespaced content reference format and require it for cross-pack references.
- Extend pack loading and API catalogs to include multiple domains (beyond items).
- Transition Dragonbane structured data out of `docs/` and `source_data/` into pack-shaped packages.

**Non-Goals:**

- A full external package manager/registry client (npm installs, remote signing, trust policy).
- A UI for enabling/disabling packs per user/adventure.
- Perfect backwards compatibility across all existing stored characters without any migration plan.

## Decisions

- Packs are “expansion-shaped” (may include multiple domains) but each domain file is validated independently.
  - Rationale: matches how books ship content while keeping data strict and machine-readable.

- Canonical ids are namespaced: `pack_id:local_id`.
  - `pack_id` comes from the pack manifest and is stable.
  - `local_id` is stable within the pack.
  - Rationale: prevents collisions when multiple packs contribute the same local ids (e.g., `human`).

- Pack layout is data-only and portable.
  - Manifest: `pack.json`
  - Domain data: `content/*.json` (e.g., `content/kins.json`, `content/items.json`)
  - Assets: `assets/**`
  - No executable code.

- Transition plan supports multiple pack roots during migration.
  - Rationale: existing local dev uses `content-packs/`, while new pack-shaped packages may live under `packages/`.
  - Implementation can support a list of roots, with the current `PACKS_DIR` as the primary root.

- Conflict handling is explicit.
  - Within a single assembled catalog, the canonical id MUST be unique.
  - If two enabled packs produce the same canonical id, the loader reports an error and excludes the conflicting entry.

## Risks / Trade-offs

- [Data migration churn] moving structured data into packs may require refactors in engine/system code → Mitigation: migrate domain-by-domain and keep compatibility shims temporarily.
- [Licensing/distribution confusion] if official-derived mechanical data is committed as distributable packs → Mitigation: treat these packs as workspace-local/dev-only unless explicitly approved for distribution; ensure manifests carry `content_license` and disclaimers.
- [Schema rigidity slows iteration] → Mitigation: version schemas and keep v1 minimal; add new fields compatibly.

## Migration Plan

1. Define pack v1 schemas and namespaced id conventions.
2. Extend loader + API catalogs for at least: kins, professions, skills, magic, equipment, items.
3. Create workspace-local Dragonbane expansion packs that provide the structured data (and original art as available).
4. Update engine/system consumers to read from the assembled catalogs rather than importing `source_data/reference-data`.
5. Introduce a character data migration/backfill path for namespaced references (as needed).

## Open Questions

- Do we standardize pack ids to npm-like names (e.g., `@dbu/dragonbane-corebook`) or allow free-form ids with a validation pattern?
- Should “system packs” (tables/formulas) be separate from “content packs” (kins/items/spells), or is it acceptable for v1 to keep them together?
