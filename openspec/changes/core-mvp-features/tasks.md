## 1. Character Sheet MVP (Data + Rules)

- [ ] 1.1 Add character schema/model aligned to character sheet fields
- [ ] 1.2 Implement derived ratings computation (HP/WP/movement/damage bonus/carrying capacity)
- [ ] 1.3 Implement skill base chance + trained skill calculation with age-based slots
- [ ] 1.4 Add character create/update endpoints and storage

## 2. Character Sheet MVP (Web UI)

- [ ] 2.1 Build character creation form for identity + base attributes
- [ ] 2.2 Build derived ratings + skills preview UI
- [ ] 2.3 Build character sheet summary view

## 3. Encounter Tracker MVP

- [ ] 3.1 Add encounter schema/model with participants and log
- [ ] 3.2 Add encounter create/update endpoints
- [ ] 3.3 Build encounter tracker UI with initiative order and turn advance
- [ ] 3.4 Add combat log entry UI and storage

## 4. Content Pack Loader

- [ ] 4.1 Define pack metadata schema and validation
- [ ] 4.2 Implement local pack discovery and metadata loading
- [ ] 4.3 Expose pack metadata in API for UI consumption

## 5. Rules DSL Baseline

- [ ] 5.1 Define rules DSL structure for derived stats and receipts
- [ ] 5.2 Implement deterministic evaluator and receipt output
- [ ] 5.3 Wire derived stats computation to DSL evaluator

## 6. Verification

- [ ] 6.1 Verify character create/edit flow and derived stats
- [ ] 6.2 Verify encounter tracker create/advance/log flow
- [ ] 6.3 Verify pack discovery + validation in local dev
