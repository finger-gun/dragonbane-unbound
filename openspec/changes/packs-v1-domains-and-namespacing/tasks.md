## 1. Schemas And Types

- [ ] 1.1 Define pack v1 manifest schema and TypeScript types (pack id, version, domains, content license)
- [ ] 1.2 Define per-domain JSON schemas and TS types for: kins, professions, skills, magic, equipment, monsters
- [ ] 1.3 Define namespaced content reference type and parsing/validation helpers

## 2. Adapters: Pack Loader V1

- [ ] 2.1 Extend local pack discovery to detect and load v1 domain files under `content/`
- [ ] 2.2 Validate each domain file and aggregate errors without crashing the app
- [ ] 2.3 Build assembled catalogs per domain with conflict detection (canonical id collisions)

## 3. API: Catalog Endpoints

- [ ] 3.1 Add endpoints to list catalogs for kins, professions, skills, magic, and equipment (in addition to items)
- [ ] 3.2 Ensure catalog responses use canonical namespaced ids
- [ ] 3.3 Add/extend pack listing endpoint to include which domains are present per pack

## 4. Engine/System: Consume Assembled Catalogs

- [ ] 4.1 Refactor Dragonbane data access to accept injected catalogs instead of importing `source_data/reference-data`
- [ ] 4.2 Provide a Dragonbane “assembled catalog” adapter in `packages/systems/dragonbane` (or equivalent)

## 5. Content Migration Into Packs

- [ ] 5.1 Create workspace-local expansion packs for Dragonbane domains (corebook, monster book, etc.)
- [ ] 5.2 Transform structured data into the v1 domain shapes (not necessarily mirroring the docs structure)
- [ ] 5.3 Add original kin portrait assets into the relevant packs and provide portrait indexes

## 6. Backwards Compatibility And Migration

- [ ] 6.1 Decide how legacy non-namespaced ids are handled for existing stored characters
- [ ] 6.2 Implement a migration/backfill path (or runtime normalization) to namespaced references

## 7. Verification

- [ ] 7.1 Unit tests for schema validation and catalog assembly (including conflict cases)
- [ ] 7.2 API tests for each catalog endpoint
- [ ] 7.3 Manual verification: character creation options populate from pack catalogs and remain stable across restarts
