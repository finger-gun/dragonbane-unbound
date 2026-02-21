## 1. Database

- [x] 1.1 Add adventure session tables (`adventures`, `adventure_members`, `adventure_characters`) with indexes
- [x] 1.2 Add encounter adventure scoping (store `adventure_id` with encounters)

## 2. Shared Types

- [x] 2.1 Add pack item catalog types to `@dbu/types` (item id, name, pack id, kind)
- [x] 2.2 Extend encounter participant type to include optional `character_id`
- [x] 2.3 Extend character inventory/equipment entries to retain optional `item_id` and `pack_id`

## 3. API: Characters

- [x] 3.1 Add `GET /characters` (list signed-in user's characters)
- [x] 3.2 Add `GET /characters?scope=all` for `game-master` role
- [x] 3.3 Add `DELETE /characters/:id` (owner-only)
- [x] 3.4 Add a narrow character update endpoint for runtime fields (conditions, HP/WP, currency, inventory)

## 4. API: Packs / Items Catalog

- [x] 4.1 Define a pack content layout for items/equipment (data-only files)
- [x] 4.2 Implement `GET /packs/items` (browse + `q` search) aggregated across packs

## 5. API: Adventures

- [x] 5.1 Implement `POST /adventures` (game-master only) returning an adventure id and join mechanism
- [x] 5.2 Implement `POST /adventures/join` to join by join mechanism
- [x] 5.3 Implement `GET /adventures` (list adventures for current user)
- [x] 5.4 Implement endpoints to associate/unassociate a character to an adventure and mark active/completed

## 6. API: Encounters

- [x] 6.1 Update encounter create to accept participants with optional `character_id`
- [x] 6.2 Update encounter create to support optional `adventure_id` and validate membership
- [x] 6.3 Update encounter read/update/advance/log endpoints to enforce adventure membership when scoped

## 7. Web: Characters

- [x] 7.1 Add character library page (list + open)
- [x] 7.2 Add character edit page for identity + runtime state (conditions, HP/WP, currency)
- [x] 7.3 Add delete character affordance with confirmation

## 8. Web: Inventory / Items

- [x] 8.1 Add item picker UI (browse + search) backed by `GET /packs/items`
- [x] 8.2 Wire item picker into character edit for adding/removing inventory/equipment

## 9. Web: Encounters

- [x] 9.1 Update encounter creation UI to select participants from character library
- [x] 9.2 If game-master, allow selecting participants from all characters

## 10. Web: Adventures

- [x] 10.1 Add adventures list page (create for GM; join for anyone)
- [x] 10.2 Add adventure detail page with member roster and character association controls
- [x] 10.3 Show active/completed adventures on character detail page

## 11. Verification

- [x] 11.1 Add API tests for character list/delete and pack item catalog
- [x] 11.2 Manual test matrix: create/list/edit/delete character; add items; toggle conditions; create encounter from character; create/join adventure and scope encounter
