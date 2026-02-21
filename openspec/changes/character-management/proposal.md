## Why

Players can create characters, but they cannot manage them afterwards (list, edit, delete), nor easily use them inside encounters. The current MVP also lacks a bridge between content packs (items) and character equipment, which blocks actual play.

## What Changes

- Add character management: list, edit, and delete characters.
- Add character runtime state editing (conditions, HP/WP, inventory/equipment).
- Expose pack content (starting with items/equipment) for browse/search and selection into a character.
- Improve encounter creation so a user can select from their characters; game masters can select from all characters.
- Introduce an "adventure" (campaign session) foundation to group characters and encounters and to show which adventures a character is active in or has completed.

## Capabilities

### New Capabilities

- `character-library`: List characters a user owns; allow game masters to list all characters.
- `character-editing`: Update and delete characters with clear rules for what is editable.
- `character-conditions`: View and update character status effects/conditions.
- `character-inventory`: Add/remove equipment and items on a character by selecting from pack-provided items.
- `pack-content-catalog`: Expose pack content (items/equipment) via API for browse/search.
- `encounter-character-roster`: Create encounters using existing character(s) as participants and keep a stable link to the character.
- `adventure-sessions`: Create/join/list adventures and associate characters to adventures with active/completed state.

### Modified Capabilities

<!-- None -->

## Impact

- Database: new tables for adventures/membership; likely new structure inside character/encounter JSON payloads to reference character ids and item ids.
- API: new endpoints for listing/deleting characters, pack item catalog, adventure create/join, and enhanced encounter creation.
- Web app: add pages for character list, character edit, and adventure list/detail; update encounter creation UI to select characters.
- AuthZ: enforce ownership by default; broaden read access for users with `game-master` role on relevant endpoints.
