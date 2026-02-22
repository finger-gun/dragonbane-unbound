## ADDED Requirements

### Requirement: Packs may include multiple typed domains

The system SHALL allow a single pack to include data for multiple content domains.

#### Scenario: Expansion pack provides multiple domains

- **WHEN** the system loads a pack that includes kin and magic domain files
- **THEN** both domains are loaded and exposed through the assembled catalogs

### Requirement: Each domain file is validated against its schema

The system SHALL validate each discovered domain file against its corresponding JSON schema.

#### Scenario: Invalid domain data is rejected

- **WHEN** a pack contains an invalid `content/kins.json`
- **THEN** the system reports validation errors and excludes the invalid domain data from assembled catalogs

### Requirement: Assembled catalogs aggregate across packs

The system SHALL assemble a catalog per domain by aggregating entries from all enabled packs.

#### Scenario: Kins catalog aggregates across packs

- **WHEN** two packs provide kin entries
- **THEN** the assembled kins catalog includes all non-conflicting kin entries from both packs

### Requirement: Canonical ids are unique within a catalog

The system SHALL enforce uniqueness of canonical ids within an assembled domain catalog.

#### Scenario: Conflicting canonical ids

- **WHEN** two packs produce the same canonical id in the same domain
- **THEN** the system reports a conflict error and excludes the conflicting entries
