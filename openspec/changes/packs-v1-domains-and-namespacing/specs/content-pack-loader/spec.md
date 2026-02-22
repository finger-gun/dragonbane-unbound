## MODIFIED Requirements

### Requirement: Content packs are discoverable

The system SHALL load available content packs from the configured local sources.

#### Scenario: Load content pack list

- **WHEN** the system starts in local dev mode
- **THEN** it lists available content packs with metadata and the discovered content domains per pack

### Requirement: Pack metadata is validated

The system SHALL validate pack metadata against the pack schema.

#### Scenario: Invalid pack metadata

- **WHEN** a pack is missing required metadata fields
- **THEN** the system rejects the pack and reports the validation error

### Requirement: Pack content is accessible

The system SHALL expose pack content to the rules engine and UI layer.

#### Scenario: Access pack content

- **WHEN** a user opens the character builder
- **THEN** the system can access pack-defined options such as kins, professions, skills, magic, equipment, and items

## ADDED Requirements

### Requirement: Pack domain files are validated

The system SHALL validate discovered pack domain files against their domain schemas.

#### Scenario: Invalid domain file

- **WHEN** a pack contains an invalid domain file
- **THEN** the system reports validation errors and does not include the invalid domain entries in assembled catalogs
