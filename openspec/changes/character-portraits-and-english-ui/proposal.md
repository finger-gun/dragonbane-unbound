## Why

Character creation and character browsing currently feel visually noisy due to dual-language labels and the lack of strong visual identity per character. Adding kin portraits (served from packs) and showing English-only labels makes the UI cleaner now, while establishing a stable “default character portrait” that can later be replaced by uploads or AI-generated images.

## What Changes

- Web UI shows English-only labels for kin, profession, skills, and item names (keep Swedish fields in data for future language switching).
- Character creation adds kin portrait visuals to the kin selector.
- When a character is created, the system stores a default character portrait reference derived from the selected kin.
- Character views/lists render the stored portrait when available.
- API serves pack-provided portrait assets so the web app never relies on `public/` for pack art.

## Capabilities

### New Capabilities

- `character-portraits`: Store and render a character portrait reference, defaulting to the selected kin portrait at creation time.
- `pack-asset-serving`: Resolve and serve pack-provided static assets (initially kin portraits) over the API.

### Modified Capabilities

- `character-sheet-mvp`: Character sheet data model includes a portrait reference field.
- `pack-content-catalog`: Pack API surface expands beyond item catalogs to support asset discovery/resolution for portraits.
- `content-pack-loader`: Pack discovery/loading supports pack asset indexes used for portrait lookup.

## Impact

- Web: update character creation and character views to remove dual-language display and to show portraits.
- API: add endpoints to resolve/serve portrait assets from discovered packs.
- Packages: introduce/extend shared types for portrait references; extend pack loader/catalog to include asset index support.
- Content: add one or more local packs that include original kin portrait assets and an index mapping kin ids to portrait paths.
