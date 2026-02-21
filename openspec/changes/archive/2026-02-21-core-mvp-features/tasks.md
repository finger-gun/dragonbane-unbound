## 1. Character Sheet MVP (Data + Rules)

- [x] 1.1 Add character schema/model aligned to character sheet fields
- [x] 1.2 Implement derived ratings computation (HP/WP/movement/damage bonus/carrying capacity)
- [x] 1.3 Implement skill base chance + trained skill calculation with age-based slots
- [x] 1.4 Add character create/update endpoints and storage

## 2. Character Sheet MVP (Web UI)

- [x] 2.1 Build character creation form for identity + base attributes
- [x] 2.2 Build derived ratings + skills preview UI
- [x] 2.3 Build character sheet summary view

## 3. Encounter Tracker MVP

- [x] 3.1 Add encounter schema/model with participants and log
- [x] 3.2 Add encounter create/update endpoints
- [x] 3.3 Build encounter tracker UI with initiative order and turn advance
- [x] 3.4 Add combat log entry UI and storage

## 4. Content Pack Loader

- [x] 4.1 Define pack metadata schema and validation
- [x] 4.2 Implement local pack discovery and metadata loading
- [x] 4.3 Expose pack metadata in API for UI consumption

## 5. Rules DSL Baseline

- [x] 5.1 Define rules DSL structure for derived stats and receipts
- [x] 5.2 Implement deterministic evaluator and receipt output
- [x] 5.3 Wire derived stats computation to DSL evaluator

## 6. Verification

- [x] 6.1 Verify character create/edit flow and derived stats
- [x] 6.2 Verify encounter tracker create/advance/log flow
- [x] 6.3 Verify pack discovery + validation in local dev
