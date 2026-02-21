## Why

Encounters currently live outside adventures, so an adventure cannot show a history of what happened at the table. Connecting encounters to adventures is the minimum needed to make adventures feel like real play sessions instead of just labels.

## What Changes

- Allow creating an encounter that is scoped to an adventure.
- Show adventure-scoped encounters from the adventure detail view.
- Allow opening/continuing an encounter from within an adventure.

## Capabilities

### New Capabilities

- `adventure-scoped-encounters`: Create, list, and view encounters that belong to an adventure.

### Modified Capabilities

<!-- None -->

## Impact

- API: add adventure-aware encounter listing and creation flows.
- Web: add an adventure selector (or context) to encounter creation; add an encounter list on adventure detail.
- Data: rely on the existing `encounters.adventure_id` column and ensure local migrations are applied.
