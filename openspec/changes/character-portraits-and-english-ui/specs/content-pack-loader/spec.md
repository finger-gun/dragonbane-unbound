## ADDED Requirements

### Requirement: Packs may provide a portrait index

The system SHALL support an optional portrait index file inside a pack to map kin references to asset paths.

#### Scenario: Pack portrait index is loaded

- **WHEN** the system discovers a pack that includes a portrait index file
- **THEN** the index entries are loaded and are available for asset resolution

#### Scenario: Invalid portrait index reports validation errors

- **WHEN** the system discovers a pack with an invalid portrait index
- **THEN** the pack is still discoverable but the system reports validation errors and ignores invalid entries
