## Why

We have a stable foundation and local dev workflow; now we need the first user-facing MVP slices that validate the core gameplay loop. These features establish the minimal loop: sign in, build a character, and run an encounter with content packs and deterministic derived stats.

## What Changes

- Add a Character Sheet MVP with create/view/edit flow, derived ratings, and skill training rules tied to the core rulebook data.
- Add an Encounter Tracker MVP with initiative order, turn flow, and a basic combat log.
- Add a Content Pack Loader baseline to discover and validate local packs.
- Add a Rules DSL baseline for derived stats and roll receipts (not full combat automation).

**Out of scope for this change:**
- Full combat automation, damage application, or tactical positioning.
- Pack publishing/sharing workflows.
- Multiplayer synchronization or real-time collaboration.

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

## Success Criteria

- A user can create a character using the corebook-backed fields and see derived ratings.
- An encounter can be created, ordered by initiative, and progressed through turns with a log.
- Local content packs are discoverable and validated with metadata errors surfaced.
- Rules evaluation emits a deterministic receipt for derived stat computations.
