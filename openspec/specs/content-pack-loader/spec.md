## Purpose

Define discovery and validation of local content packs and making pack data accessible to the engine and UI.

## Requirements

### Requirement: Content packs are discoverable

The system SHALL load available content packs from the configured local sources.

#### Scenario: Load content pack list

- **WHEN** the system starts in local dev mode
- **THEN** it lists available content packs with metadata

### Requirement: Pack metadata is validated

The system SHALL validate pack metadata against the pack schema.

#### Scenario: Invalid pack metadata

- **WHEN** a pack is missing required metadata fields
- **THEN** the system rejects the pack and reports the validation error

### Requirement: Pack content is accessible

The system SHALL expose pack content to the rules engine and UI layer.

#### Scenario: Access pack content

- **WHEN** a user opens the character builder
- **THEN** the system can access pack-defined options such as professions or items
