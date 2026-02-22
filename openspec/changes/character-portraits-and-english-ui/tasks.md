## 1. Data Model And Shared Types

- [x] 1.1 Define `CharacterPortrait` (discriminated union) in `@dbu/types` and add it to `CharacterSheet`
- [x] 1.2 Define a namespaced `ContentRef`/`KinRef` type for portrait references (string shape) and document its format
- [x] 1.3 Add minimal JSON schema (or runtime validation) for pack portrait index entries used by the loader

## 2. Pack Portrait Index And Loader Support

- [x] 2.1 Define pack convention for kin portraits (standard directory + default filename rule)
- [x] 2.2 Add optional `assets/portraits/index.json` support in `@dbu/adapters` local pack loading
- [x] 2.3 Ensure pack loader surfaces validation errors for invalid/missing portrait index entries

## 3. API: Asset Resolution And Serving

- [x] 3.1 Add API endpoint to resolve a kin portrait from a kin reference to a stable asset URL
- [x] 3.2 Add API endpoint to serve pack asset bytes (images) with correct `Content-Type` and safe errors
- [x] 3.3 Ensure asset endpoints are protected by existing auth middleware and do not leak filesystem paths

## 4. Content: Local Portrait Packs

- [x] 4.1 Create (or update) local pack(s) under `content-packs/` that include original kin portraits and a portrait index
- [x] 4.2 Ensure the pack ids and kin ids used in the index match the ids used by character creation kin options

## 5. Web: English-Only Presentation

- [x] 5.1 Remove dual-language rendering (`name / name_sv`) from character creation selectors
- [x] 5.2 Remove Swedish display lines from character summary and other character-facing views (keep Swedish in data)
- [x] 5.3 Ensure item search still works even when Swedish is not displayed (optional)

## 6. Web: Kin Portrait Selector And Character Portrait Rendering

- [x] 6.1 Add kin portrait rendering to the kin selection UI (grid or enhanced selector)
- [x] 6.2 On character create, persist `CharacterSheet.portrait` default derived from selected kin
- [x] 6.3 Render character portraits in the character library list and character detail views
- [x] 6.4 Implement safe fallback placeholder when portrait resolution fails

## 7. Verification

- [x] 7.1 Add tests for pack portrait index parsing/validation in `@dbu/adapters`
- [x] 7.2 Add tests for asset resolution behavior and missing-asset safety in `apps/api`
- [ ] 7.3 Manual verification: create character with each kin and confirm portrait appears in creation + library + detail
