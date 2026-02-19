## Why

We have a stable foundation and local dev workflow; now we need the first user-facing MVP slices that validate core gameplay flow. These three features establish the minimal loop: sign in, build a character, and run an encounter with content packs.

## What Changes

- Add a Character Sheet MVP with create/view/edit flow and derived stats.
- Add an Encounter Tracker MVP with initiative order, turn flow, and combat log.
- Add a Content Pack Loader + Rules DSL baseline to load packs and compute rules-derived values.

## Capabilities

### New Capabilities
- `character-sheet-mvp`: Minimal character model, editor, and derived stats.
- `encounter-tracker-mvp`: Initiative + turn flow + basic encounter state.
- `content-pack-loader`: Load/validate content packs and expose available content.
- `rules-dsl-baseline`: Minimal rules DSL for derived stats and roll receipts.

### Modified Capabilities
- (none)

## Impact

- Web UI for character and encounter flows.
- Engine/types packages for rules and content loading.
- API endpoints for characters/encounters and pack metadata.
- Data schema for characters, encounters, and packs.
