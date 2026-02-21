## 1. API

- [ ] 1.1 Add `GET /adventures/:id/encounters` list endpoint (member-only)
- [ ] 1.2 Ensure encounter `GET/PUT/advance/log` authorize by adventure membership when `adventure_id` is set

## 2. Web

- [ ] 2.1 Add "New encounter" action on adventure detail (pre-fills adventure context)
- [ ] 2.2 Add "Encounters" list section on adventure detail (open existing encounters)
- [ ] 2.3 Update encounter creation UI to accept an `adventure_id` context (query param or selector)

## 3. Verification

- [ ] 3.1 Manual: create encounter in adventure and verify it appears in the adventure detail
