## Context

Character creation and character browsing currently display both English and Swedish labels (e.g. `name` and `name_sv`) which makes the UI feel cluttered. The repo already contains original kin portraits under `assets/portraits/kins/`, but the web app does not have a mechanism to render them as pack-served assets.

The platform direction is modular, pack-driven content. Static art should be delivered by packs and served through the API so the web app does not rely on `apps/web/public/` for pack assets.

Constraints:

- Keep Swedish fields in data for future localization, but show English-only now.
- Portraits are original (not official rulebook art) and should live inside the kin-providing packs.
- Characters should have a stable “portrait reference” that can later be replaced by upload or AI generation without rewriting existing character records.

## Goals / Non-Goals

**Goals:**

- Show English-only labels across character creation and character views.
- Add kin portraits to the kin selection experience.
- Persist a default character portrait derived from the selected kin.
- Serve portrait images via the API from discovered packs.

**Non-Goals:**

- Implement user uploads or AI generation of character portraits.
- Build a general CDN or remote asset store.
- Redesign encounter UI to use portraits (can be a follow-up once portraits exist on characters).

## Decisions

- Store portraits as references (not raw URLs) on the character sheet.
  - Rationale: URLs and hosting can change as packs move between local folders, npm packages, or other sources.
  - Alternative: store a URL string directly. Rejected because it couples persisted state to a deployment detail.

- Serve pack assets via the API.
  - Rationale: keeps the web app pack-agnostic and supports packs that include images.
  - Alternative: copy/sync assets into `apps/web/public/`. Rejected because it breaks the “packs own their assets” boundary.

- Pack portrait lookup uses an optional index file with a convention fallback.
  - Rationale: most core kins can follow a simple naming convention, but expansion/homebrew kins may not.
  - Convention: `${kinId}.png` under a standard portraits directory.
  - Index override: `assets/portraits/index.json` can map a kin reference to a relative asset path.

- English-only is a UI policy, not a data deletion.
  - Rationale: future language switching remains possible with minimal migration.

## Risks / Trade-offs

- [Portrait refs become stale] if a pack is removed or an asset path changes → Mitigation: resolver returns a safe placeholder and UI gracefully falls back.
- [Pack asset serving expands API surface] → Mitigation: keep endpoints minimal (resolve + serve) and behind existing auth.
- [Index format drift across packs] → Mitigation: validate index schema and report pack validation errors without crashing the app.

## Migration Plan

1. Add new character portrait field as optional; backfill is not required.
2. Introduce a local portraits-enabled pack (or packs) that include kin portraits and an index.
3. Add API asset serving/resolution.
4. Update web character creation and character views to use English-only labels and show portraits.

## Open Questions

- Should the character portrait field be required for newly created characters, or best-effort (nullable) if the asset cannot be resolved?
- Do we want a single canonical endpoint that returns a stable URL for an `asset_ref`, or should the UI construct URLs directly?
