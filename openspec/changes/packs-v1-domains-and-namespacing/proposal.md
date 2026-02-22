## Why

The platform is moving toward modular “expansion packs”, but pack loading currently only supports a minimal item catalog and uses non-namespaced ids that will collide as multiple packs are enabled. Defining v1 pack domain schemas and namespaced content references unlocks modular kin/profession/magic/equipment/monster data (and original art) while keeping engine logic decoupled from where content is sourced.

## What Changes

- Define v1 schemas for pack manifests and typed domain payloads (kins, professions, skills, magic, equipment, monsters, and portrait indexes).
- Introduce canonical namespaced content references (`pack_id:local_id`) and require them for cross-pack references.
- Extend the local pack loader and API catalog to aggregate multiple content domains, not only items.
- Migrate existing structured data out of `docs/` and `source_data/` into pack-shaped packages (workspace-local now; publishable later).

## Capabilities

### New Capabilities

- `pack-domains-v1`: Packs can deliver multiple typed content domains (expansion-style) validated by per-domain schemas.
- `namespaced-content-refs`: Canonical content identifiers are namespaced to avoid collisions across packs.

### Modified Capabilities

- `content-pack-loader`: Pack discovery/validation expands to load and validate v1 domain files.
- `pack-content-catalog`: API catalog expands beyond items to expose additional domains and namespaced ids.
- `character-sheet-mvp`: Character sheet identity and equipment fields store namespaced references for pack-defined content.

## Impact

- Packages: new schemas/types for pack domain data; adapters extended for domain loading and validation.
- API: new/expanded endpoints for catalog access across domains.
- Engine/system: stop importing Dragonbane data from `source_data/reference-data` and instead consume assembled catalogs.
- Content: create one or more workspace-local expansion packs (core rulebook, monster book, etc.) containing structured data and original art assets.
