## ADDED Requirements

### Requirement: Canonical content references are namespaced

The system SHALL use namespaced canonical content references with the format `pack_id:local_id`.

#### Scenario: Canonical id format

- **WHEN** the system exposes a pack-provided entity (e.g., an item or kin)
- **THEN** it assigns and returns a canonical id using the `pack_id:local_id` format

### Requirement: Canonical references are stable

The system SHALL treat canonical references as stable identifiers for persisted state.

#### Scenario: Persisting a reference

- **WHEN** a character stores a reference to a kin, profession, weapon, or armor entry
- **THEN** the stored reference uses the canonical namespaced id

### Requirement: References can be parsed safely

The system SHALL be able to parse a canonical reference into its component parts.

#### Scenario: Parse a canonical reference

- **WHEN** a caller provides a canonical reference string
- **THEN** the system returns the `pack_id` and `local_id` components or a validation error
